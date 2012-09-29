Syncd.Models.SongRelational = Backbone.RelationalModel.extend({

  initialize: function() {
    _.bindAll(this);
   },

  initSong: function() {
    //filter out where playlist doesn't exist
  	var self = this;
    if(this.get("image") == null) {
      this.set("image", 'http://25.media.tumblr.com/tumblr_m704va32Qw1qzo6tso1_500.jpg');
    }

    // If object is from soundcloud
    sc_track = this.get("audio") ? this.get("audio").match(/tracks.\d+/) : false;
    if (sc_track) {
      SC.stream("/"+sc_track, {
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
        self.soundObject_id = soundobject.id;
      });
    } else {
      // If object is not from soundcloud
      this.soundObject_id = "id-"+this.id;
      soundManager.createSound({
        id: this.soundObject_id,
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
    soundManager.getSoundById(nextModel.soundObject_id).play();

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
    soundManager.getSoundById(prev.soundObject_id).play();

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
    soundManager.play(this.soundObject_id);

    if (this.get("failed")) {
      this.nextSong();
    } else {
      this.trigger("play");
    }
  },

  stop: function() {
    soundManager.pause(this.soundObject_id);
  },

  delete: function() {
    soundManager.destroySound(this.soundObject_id);
    this.destroy();
  }



});