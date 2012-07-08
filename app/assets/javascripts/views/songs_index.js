Syncd.Views.SongsIndex = Backbone.View.extend({
  initialize: function(options) {
    _.bindAll(this);
    this.vent = options.vent;
    this.vent.on("updateSongs", this.renderSongs);
  },

  events: {
  },


  render: function () {
    return this;
  },

  renderSongs: function (collection) {
    var self = this;
    this.$el.html("");
    collection.each(function(songModel) {
      var song = new Syncd.Views.Song({model: songModel});
      self.$el.append(song.render().el);
    });

  }
});

