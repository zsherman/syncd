Syncd.Views.Song = Backbone.View.extend({

  initialize: function(options) {
    this.tmpl = options.tmpl;
    _.bindAll(this);
  },

  render: function () {
    var width = $("#center").width();
    if (width < 565) {
      this.$el.addClass('album2').html(JST["songs/song"]({song: this.model}));
    } else {
      this.$el.addClass('album').html(JST["songs/songlist"]({song: this.model}));
    }
    return this;
  }

});