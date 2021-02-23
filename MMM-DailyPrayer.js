//dailybibleverse.js

Module.register("MMM-DailyPrayer", {
    // Default module config.
    result: [],
    defaults: {
        title: 'Beseeching.org',
        titleSize: 'bright small',
        bodySize: 'small',
        alignment: null,
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
        var day = ""

        if(this.prayerOfTheDay != null && this.prayerDescription != null && this.prayerDay != null) {
            prayer = this.prayerOfTheDay;
            description = this.prayerDescription;
            day = this.prayerDay;
        }

        var alignment = this.config.alignment ? ' '+this.config.alignment : ''

        var wrapper = document.createElement("div");

        const origin = document.createElement("div");
        origin.className = 'dimmed xsmall' + alignment;
        origin.innerHTML = this.config.title;
        wrapper.appendChild(origin);

        const title  = document.createElement("div");
	      title.innerHTML = prayer;
        title.className = 'bright ' + this.config.titleSize + alignment;
        wrapper.appendChild(title)

        if (this.config.showDetails) {
          const date  = document.createElement("div");
          date.innerHTML = day;
          date.className = 'xsmall' + alignment;
          wrapper.appendChild(date)

          const body  = document.createElement("div");
          body.className = 'body ' + this.config.bodySize + alignment
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
            this.prayerDay = payload.date;
            this.prayerDescription = payload.body;

            this.updateDom();
        }
    }
});
