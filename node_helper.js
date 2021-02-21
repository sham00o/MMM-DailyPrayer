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
		var url = 'https://beseeching.org/pray/'

		request({ url: url, method: 'GET' }, function(error, response, body) {
			if(!error && response.statusCode == 200){
				var soup = new JSSoup(body);
				console.log(body);
				console.log(soup)
				post = soup.find("h2", {"class": "fl-post-feed-title"})
				console.log(post)
				console.log(post.a)
				console.log(post.a.attrs)
				var result = post.a.attrs.title
				self.sendSocketNotification('PRAYER_RESULT', result);
			}
		});
	}
});
