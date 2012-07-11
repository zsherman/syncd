Syncd.Views.Song = Backbone.View.extend({

  initialize: function(options) {
    _.bindAll(this);
    this.indexid = options.index;
    this.vent = options.vent;
    this.vent.on("switchSongs", this.switchSongs);
  },

  events: {
    "mouseenter": "showPlay",
    "mouseleave": "hidePlay",
    "click .album .play": "play"
  },

  render: function () {
    //console.log(this.model.get("image"));
    var self = this;
    var width = $("#center").width();
    if (width < 565) {
      this.$el.addClass('album2').html(JST["songs/songlist"]({song: this.model, index: this.indexid}));
    } else {
      this.$el.addClass('album').html(JST["songs/song"]({
        song: this.model, index: this.indexid}
        )).draggable({ helper: function(){
                $copy = self.$el.clone();
                return $copy;
                },
                appendTo: 'body',
                scroll: false, zIndex: 1000 });
        this.$el.append("<div class='loading'></div>");
      $('<img />')
        .attr('src', this.model.get("image"))
        .load(function(){
            $(".loading", self.$el).remove();
            self.$el.append( $(this) );
        });
      }
    return this;
  },

  showPlay: function() {
    this.$el.append("<div class='play'></div>");
  },

  hidePlay: function() {
    $(".play", this.el).remove();  
  },

  play: function() {
    var self = this;
    $(".play", this.el).removeClass().addClass("stop");
    this.$el.off();
    this.vent.trigger("switchSongs", this.model);

    // New event handlers
    $(".stop", this.el).on("click", function() {
      $(this).removeClass().queue(function() {
        var that = this;
        self.$el.on("mouseenter", self.showPlay);
        self.$el.on("mouseleave", self.hidePlay);
        self.$el.on("click", "div.play", self.play);
      });
    });
  },

  switchSongs: function(model) {
    var id = model.id;
    if (id != this.model.id && $('.stop', this.el)) {
      $(".stop", this.el).remove();
      this.$el.on("mouseenter", this.showPlay);
      this.$el.on("mouseleave", this.hidePlay);
      this.$el.on("click", "div.play", this.play);
    }
  }

});