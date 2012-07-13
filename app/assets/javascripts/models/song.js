Syncd.Models.Song = Backbone.Model.extend({

  initialize: function() {
   },

  initSongs: function() {
  	var self = this;
  	var id = this.id.toString();
    soundManager.createSound({
    id: id,
    url: this.get("audio"),
    autoLoad: false,
    autoPlay: false,
    onload: function() {
    },
    onplay: function() {
    },
    onresume: function() {
      self.trigger("resumed", self);
    },
    whileloading: function() {
      //console.log(this.durationEstimate);
    },
    onfinish: function() {
      self.nextSong();
  	},
    onstop: function() {
      self.trigger("stop");
    },
    onpause: function() {
      self.trigger("stop");
    },
    volume: 50
    });
  },

  nextSong: function() {
    var index = this.collection.indexOf(this);
    var nextModel = this.collection.at(index+1);
    var nextModelid = nextModel.id.toString();
    var currentModel = this; 
    var currentModelid = currentModel.id.toString();

    // Play upcoming song
    soundManager.getSoundById(nextModelid).play();

    // Remove play view for previous song
    this.trigger("stop");

    // Trigger upcoming song to play view
    nextModel.trigger("play");

    // Update state
    //console.log(window);
    //window.Syncd.playlists.trigger("stateChange",nextModelid);
    //this.collection.trigger("stateChange", nextModelid);
  }, 

  play: function() {
    soundManager.pauseAll();
    soundManager.play(this.id.toString());
    this.trigger("play");
  },

  stop: function() {
    soundManager.pause(this.id.toString());
  }

});