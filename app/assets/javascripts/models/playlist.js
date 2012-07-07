Syncd.Models.Playlist = Backbone.Model.extend({
  defaults: {
      id: null,
      name: null,
      description: null
  },


  initialize: function() {
  },

  urlRoot: '/playlists'

});