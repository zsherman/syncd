Syncd.Models.Playlist = Backbone.Model.extend({

  initialize: function() {
  	this.initSongs();
  },

  urlRoot: '/playlists',

  initSongs: function() {
  	var songs = this.get("songs");
  	this.songs = new Syncd.Collections.Songs({collection: songs})
  },

  parse: function(response) {
  	this.songs = this.songs.reset(response.songs); // Repopulate songs collection
  	var attrs = {};
  	_.each(response, function(value, key) {
  		attrs[key] = value;
  	});
  	attrs.songs = this.songs;
  	return attrs;
  }

});