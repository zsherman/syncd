Syncd.Views.SongsIndex = Backbone.View.extend({
  initialize: function(options) {
    _.bindAll(this);
    this.vent = options.vent;
    this.vent.on("loadSongs", this.renderSongs);
    $(window).resize(this.resizeSongs);
  },

  events: {
  },


  render: function () {
    return this;
  },

  renderSongs: function (model) {
    var self = this;
    this.$el.html("");
    if (model) {
      this.collection = model.get("songs");
    }
    this.collection.each(function(model,index) {
      var song = new Syncd.Views.Song({model: model, index: index, vent: self.vent});
      self.$el.append(song.render().el);
    });
  },

  resizeSongs: function () {
    this.renderSongs();
  }
});

