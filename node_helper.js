/* Magic Mirror
 * Node Helper: MMM-DailyPrayer
 *
 * By Arthur Garza
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var request = require('request');
var JSSoup = require('jssoup').default;


module.exports = NodeHelper.create({
	// Subclass start method.
	start: function() {
		console.log("Started node_helper.js for MMM-DailyPrayer.");
	},

	socketNotificationReceived: function(notification, payload) {
		console.log(this.name + " node helper received a socket notification: " + notification + " - Payload: " + payload);
		this.prayerRequest(payload);
	},

	prayerRequest: function() {
		var self = this;
		var url = 'https://beseeching.org/pray/'

		request({ url: url, method: 'GET' }, function(error, response, body) {
			if(!error && response.statusCode == 200){
				var soup = new JSSoup(body);
				// extract title
				title = soup.find("h2", {"class": "fl-post-feed-title"})
				anchor = title.nextElement
				link = anchor.attrs.href
				span = soup.find("span", {"class": "fl-post-feed-date"})
				date = span.text
				request({ url: link, method: 'GET' }, function(error, response, body) {
					if(!error && response.statusCode == 200){
						var soup = new JSSoup(body);
						// extract content
						body = soup.find("div", {"class": "fl-post-content"})
						var contents = []
						for (var [index, each] of body.contents.entries()) {
							var text = each.text.toLowerCase()
							if (text.includes('ministry portion')) break
							var sup = each.find("sup")
							if (sup && index != 0) continue
							contents.push(each.toString())
						}
						var result = {
							title: anchor.attrs.title,
							date: date,
							body: contents.join('')
						}
						self.sendSocketNotification('PRAYER_RESULT', result);
					}
				});
			}
		});
	}
});
