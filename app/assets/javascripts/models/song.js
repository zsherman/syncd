Syncd.Models.Song = Backbone.Model.extend({

  initialize: function() {
    _.bindAll(this);
    this.uuid = "id-"+this.createuuid();
   },

  initSong: function() {
    //filter out where playlist doesn't exist
  	var self = this;

    // Check to see if audio url is not null
    if(!this.get("audio")) {
      return false;
    }

    // Check to see if image exists
    if(!this.get("image")) {
      this.set("image", 'http://25.media.tumblr.com/tumblr_m704va32Qw1qzo6tso1_500.jpg');
    }

    // Check to see f object is from soundcloud
    sc_track = this.get("audio") ? this.get("audio").match(/tracks.\d+/) : false;
    
    if (sc_track) {
      SC.stream("/"+sc_track, {
        id: this.uuid,
        url: this.get("audio"),
        autoLoad: false,
        autoPlay: false,
        onload: function() {
          if (!status) {
            self.set("failed", true);
            self.nextSong();
          } 
        },
        onplay: function() {
          Syncd.vent.trigger("play", self);
        },
        onresume: function() {
          self.trigger("resumed", self);
          Syncd.vent.trigger("play", self);
        },
        whileloading: function() {
          //console.log(this.durationEstimate);
        },
        onfinish: function() {
          console.log("song finished");
          self.nextSong();
        },
        ondataerror: function() {
          self.nextSong();
        },
        onstop: function() {
          self.trigger("stop");
          Syncd.vent.trigger("pause", self);
        },
        onpause: function() {
          self.trigger("stop");
          Syncd.vent.trigger("pause", self);
        },
        volume: 50,
        autoPlay: false
      },
      function(soundobject) {
        self.uuid = soundobject.id;
      });
    } else {
      // If object is not from soundcloud
      soundManager.createSound({
        id: this.uuid,
        url: this.get("audio"),
        autoLoad: false,
        autoPlay: false,
        onload: function(status) {
          if (!status) {
            self.set("failed", true);
            self.nextSong();
          } 
        },
        onplay: function() {
          Syncd.vent.trigger("play", self);

        },
        onresume: function() {
          self.trigger("resumed", self);
          Syncd.vent.trigger("play", self);
        },
        whileloading: function() {
          //console.log(this.durationEstimate);
        },
        onfinish: function() {
          console.log("song finished");
          self.nextSong();
      	},
        ondataerror: function() {
          self.nextSong();
        },
        onstop: function() {
          self.trigger("stop");
          Syncd.vent.trigger("pause", self);
        },
        onpause: function() {
          self.trigger("stop");
          Syncd.vent.trigger("pause", self);
        },
        volume: 50
      });
    }
  },

  nextSong: function() {
    console.log("Next song is starting...");
    soundManager.pauseAll();
    var index = this.collection.indexOf(this);
    var nextModel = this.collection.at(index+1);

    // Play upcoming song
    soundManager.getSoundById(nextModel.uuid).play();

    // Remove play view for previous song
    this.trigger("stop");

    // Trigger upcoming song to play view
    if (nextModel.get("failed")) {
      nextModel.nextSong();
    } else {
      nextModel.trigger("play");
    }
  }, 

  prevSong: function() {
    soundManager.pauseAll();
    var index = this.collection.indexOf(this);
    var prev = this.collection.at(index-1);

    // Play previous song
    soundManager.getSoundById(prev.uuid).play();

    // Remove play view for previous song
    this.trigger("stop");

    // Trigger previous song to play view
    if (prev.get("failed")) {
      prev.prevSong();
    } else {
      prev.trigger("play");
    }
  },

  play: function() {
    soundManager.pauseAll();
    soundManager.play(this.uuid);

    if (this.get("failed")) {
      this.nextSong();
    } else {
      this.trigger("play");
    }
  },

  stop: function() {
    soundManager.pause(this.uuid);
  },

  delete: function() {
    soundManager.destroySound(this.uuid);
    this.destroy();
  },

  createuuid: function() {
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });

    return uuid;
  }



});