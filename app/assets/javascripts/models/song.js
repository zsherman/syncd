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
      //alert(this.durationEstimate);
    },
    onresume: function() {
    },
    whileloading: function() {
      //console.log(this.durationEstimate);
    },
    onfinish: function() {
      self.nextSong();
  	},
    volume: 50
    });
  },

  nextSong: function() {
    var index = this.collection.indexOf(this);
    var modelAbove = this.collection.at(index+1);
    var id = this.id;
    soundManager.stop(id.toString());
    modelAbove.trigger("nextSong", this);
  }

});