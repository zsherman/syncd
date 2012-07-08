Syncd.Views.Song = Backbone.View.extend({

  initialize: function(options) {
    _.bindAll(this);
  },

  render: function () {
    this.$el.html(JST["songs/song"]({song: this.model}));
    return this;
  }

});