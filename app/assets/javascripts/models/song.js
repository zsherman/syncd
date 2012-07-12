Syncd.Models.Song = Backbone.Model.extend({

  initialize: function() {
  },

  initSongs: function() {
    soundManager.createSound({
    id: this.id,
    url: this.get("audio"),
    autoLoad: false,
    autoPlay: false,
    onload: function() {
      //alert('The sound '+this.id+' loaded!');
    },
    onplay: function() {
      //alert(this.durationEstimate);
    },
    onresume: function() {
      //alert(this.durationEstimate);
    },
    whileloading: function() {
      //console.log(this.durationEstimate);
    },
    volume: 50
    });
  }

});