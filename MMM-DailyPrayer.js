//dailybibleverse.js

Module.register("MMM-DailyPrayer", {
    // Default module config.
    result: [],
    defaults: {
        // Default Bible version is ESV.
        // Change it to a version that BibleGateway.com supports.
        // https://www.biblegateway.com/usage/linking/versionslist/
        version: 'ESV'
    },

    start: function() {
        Log.info("Starting module: " + this.name);
        var self = this;

        var configuredVersion = this.config.version;

        //Do this once first
        self.sendSocketNotification('START', configuredVersion);

        //Then every hour
        setInterval(function() {
                self.sendSocketNotification('START', configuredVersion);
        }, 3600000); //perform every hour (3600000 milliseconds)
    },

    getStyles: function () {
        return ["MMM-DailyPrayer.css"];
    },

    // Override dom generator.
    getDom: function() {
        Log.log("Updating MMM-DailyPrayer DOM.");

        var prayer = "";

        if(this.prayerOfTheDay != null){
            prayer = this.prayerOfTheDay;
        }

        var wrapper = document.createElement("div");
        switch (this.config.size) {
            case 'xsmall':
                wrapper.className = "bright xsmall";
                break;
            case 'small':
                wrapper.className = "bright small";
                break;
            case 'medium':
                wrapper.className = "bright medium";
                break;
            case 'large':
                wrapper.className = "bright large";
                break;
            default:
                wrapper.className = "bright medium";
        }
        wrapper.innerHTML = prayer;
        return wrapper;
        },

    getScripts: function() {
        return [
            this.file('jquery-3.1.1.min.js'), // this file will be loaded straight from the module folder.
        ]
    },

    socketNotificationReceived: function(notification, payload) {
        Log.log("socket received from Node Helper");
        if(notification == "PRAYER_RESULT"){
            Log.log(payload);
            this.prayerOfTheDay = payload;

            this.updateDom();
        }
    }
});
