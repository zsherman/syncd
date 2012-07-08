Syncd.Models.Playlist = Backbone.Model.extend({

  initialize: function() {
    this.parseSongs();
  },

  urlRoot: '/playlists',

  parseSongs: function() {
  	var songs = _.map(this.get('songs'), function(obj){ return obj.song }, this);
  	this.songs = new Syncd.Collections.Songs(songs); 
  	console.log(this.songs);
  }

});