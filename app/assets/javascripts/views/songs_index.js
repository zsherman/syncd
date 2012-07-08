Syncd.Views.SongsIndex = Backbone.View.extend({
  initialize: function(options) {
    _.bindAll(this);
    this.vent = options.vent;
  },

  events: {
  },


  render: function () {
    this.$el.html("test");
    return this;
  }
});

