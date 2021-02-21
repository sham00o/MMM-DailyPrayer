//dailybibleverse.js

Module.register("MMM-DailyPrayer", {
    // Default module config.
    result: [],
    defaults: {
        title: 'Beseeching.org',
        size: 'bright small',
        showDetails: false
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

    getScripts: function() {
        return [
            this.file('jquery-3.1.1.min.js'), // this file will be loaded straight from the module folder.
        ]
    },

    // Override dom generator.
    getDom: function() {
        Log.log("Updating MMM-DailyPrayer DOM.");

        var prayer = "";
        var description = "";

        if(this.prayerOfTheDay != null && this.prayerDescription != null){
            prayer = this.prayerOfTheDay;
            description = this.prayerDescription;
        }

        var sharedClass = this.config.showDetails ? ' expanded' : ''

        var wrapper = document.createElement("div");
        wrapper.className = 'large';

        const origin = document.createElement("div");
        origin.className = 'dimmed xsmall' + sharedClass;
        origin.innerHTML = this.config.title;
        wrapper.appendChild(origin);

        const title  = document.createElement("div");
        switch (this.config.size) {
            case 'xsmall':
                title.className = "bright xsmall" + sharedClass;
                break;
            case 'small':
                title.className = "bright small" + sharedClass;
                break;
            case 'medium':
                title.className = "bright medium" + sharedClass;
                break;
            case 'large':
                title.className = "bright large" + sharedClass;
                break;
            default:
                title.className = "bright medium" + sharedClass;
        }
        title.innerHTML = prayer;
        wrapper.appendChild(title)

        if (this.config.showDetails) {
          const body  = document.createElement("div");
          var size = !this.config.size ? "medium" : this.config.size
          body.className = 'body ' + size + sharedClass
          body.innerHTML = description;
          wrapper.appendChild(body)
        }

        return wrapper;
      },

    socketNotificationReceived: function(notification, payload) {
        Log.log("socket received from Node Helper");
        if(notification == "PRAYER_RESULT"){
            Log.log(payload);
            this.prayerOfTheDay = payload.title;
            this.prayerDescription = payload.body;

            this.updateDom();
        }
    }
});
