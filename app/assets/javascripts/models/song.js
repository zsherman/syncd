Syncd.Models.Song = Backbone.RelationalModel.extend({

  initialize: function() {
    _.bindAll(this);
    try {
      this.initSongs();
    } catch (err) {
      // do nothing
    }
   },

  initSongs: function() {
    //filter out where playlist doesn't exist
  	var self = this;
    if(this.get("image") == null) {
      this.set("image", 'http://25.media.tumblr.com/tumblr_m704va32Qw1qzo6tso1_500.jpg');
    }
    if(typeof this.collection.playlist != "undefined") {
      var p_id = this.collection.playlist.id.toString();
    } else {
      var p_id = "search";
    }
  	var m_id = this.id.toString();
    var id = "id-" + p_id + "-" + m_id;

    // If object is from soundcloud
    sc_track = this.get("audio").match(/tracks.\d+/);
    if (sc_track) {
      SC.stream("/"+sc_track, {
        url: this.get("audio"),
        autoLoad: false,
        autoPlay: false,
        onload: function() {
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
      this.soundObject_id = id;
      soundManager.createSound({
        id: id,
        url: this.get("audio"),
        autoLoad: false,
        autoPlay: false,
        onload: function() {
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
    var nextModelid = nextModel.soundObject_id;

    // Play upcoming song
    soundManager.getSoundById(nextModelid).play();

    // Remove play view for previous song
    this.trigger("stop");

    // Trigger upcoming song to play view
    nextModel.trigger("play");
  }, 

  prevSong: function() {
    soundManager.pauseAll();
    var index = this.collection.indexOf(this);
    var prev = this.collection.at(index-1);
    var prevModelid = prev.soundObject_id;

    // Play upcoming song
    soundManager.getSoundById(prevModelid).play();

    // Remove play view for previous song
    this.trigger("stop");

    // Trigger upcoming song to play view
    prev.trigger("play");
  },

  play: function() {
    soundManager.pauseAll();
    soundManager.play(this.soundObject_id);
    this.trigger("play");
  },

  stop: function() {
    soundManager.pause(this.soundObject_id);
  },

  delete: function() {
    soundManager.destroySound(this.soundObject_id);
    //this.collection.remove(this.id);
    this.destroy();
  }



});