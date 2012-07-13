Syncd.Views.Song = Backbone.Marionette.ItemView.extend({

  initialize: function(options) {
    _.bindAll(this);

    this.model.initSongs();
    this.index = this.model.collection.indexOf(this.model);
    
    this.bindTo(this.model, "stop", this.stop);
    this.bindTo(this.model, "play", this.play);

    this.state = options.state;
    // this.vent = options.vent;

  },

  events: {
    "hover": "showPlay",
    "mouseleave": "hidePlay",
    "click .album .play": "clickPlay"
  },

  render: function () {
    var self = this;

    // Check to see if album view or list view should be rendered
    var width = $("#center").width();
    if (width < 565) {
      this.$el.addClass('album2').html(JST["songs/songlist"]({song: this.model, index: this.index}));
    } else {
      this.$el.addClass('album').html(JST["songs/song"]({
        song: this.model, index: this.index}
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

    // Check state object to see if song is currently being played
    // If so, display "stop" button, remove all current events, and 
    // add new onclick event 
    if (this.state.id === this.model.id) {
      this.$el.off();
      this.$el.on("click .album .stop", this.clickStop);
      this.$el.append("<div class='stop'></div>");
    }
    return this;
  },

  showPlay: function() {
    this.$el.append("<div class='play'></div>");
    return this;
  },

  hidePlay: function() {
    $(".play", this.el).remove();  
  },

  clickPlay: function() {
    this.model.play();
  },

  play: function() {
    this.$el.off();
    this.$el.on("click .album .stop", this.clickStop);
    $(".play", this.el).remove();
    this.$el.append("<div class='stop'></div>");
    this.state.id = this.model.id;
  },

  clickStop: function() {
    this.model.stop();
  },

  stop: function() {
    $(".stop", this.el).removeClass();
    this.refreshEvents();
  },
 
  refreshEvents: function() {
    this.$el.on("click .album .play", this.clickPlay);
    this.$el.on("hover", this.showPlay);
    this.$el.on("mouseleave", this.hidePlay);
  }

});