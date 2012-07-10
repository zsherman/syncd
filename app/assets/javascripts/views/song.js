Syncd.Views.Song = Backbone.View.extend({

  initialize: function(options) {
    _.bindAll(this);
    this.indexid = options.index;
  },

  render: function () {
    //console.log(this.model.get("image"));
    var self = this;
    var width = $("#center").width();
    if (width < 565) {
      this.$el.addClass('album2').html(JST["songs/songlist"]({song: this.model, index: this.indexid}));
    } else {
      this.$el.addClass('album').html(JST["songs/song"]({song: this.model, index: this.indexid}));
      this.$el.append("<div class='loading'></div>");
      $('<img />')
        .attr('src', this.model.get("image"))
        .load(function(){
            $(".loading", self.$el).remove();
            self.$el.append( $(this) );
        });
      }
    return this;
  }

});