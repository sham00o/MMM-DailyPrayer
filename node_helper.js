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
				title = soup.find("h2", {"class": "fl-post-feed-title"})
				anchor = title.nextElement
				body = soup.find("div", {"class": "fl-post-feed-content"})
				p = body.nextElement
				strong = p.nextElement
				contents = strong.toString()
				var result = {
					title: anchor.attrs.title,
					body: contents
				}
				console.log(result)
				self.sendSocketNotification('PRAYER_RESULT', result);
			}
		});
	}
});
