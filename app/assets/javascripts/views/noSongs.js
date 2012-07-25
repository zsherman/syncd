Syncd.Views.NoSongs = Backbone.Marionette.CollectionView.extend({

  initialize: function(options) {
    _.bindAll(this);
  },

  render: function () {
    this.$el.html("");
    this.$el.html("Add some songs to get started");
  },

});