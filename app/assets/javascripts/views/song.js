Syncd.Views.Song = Backbone.Marionette.ItemView.extend({

  initialize: function(options) {
    _.bindAll(this);

//    this.model.initSongsonce();
    this.index = this.model.collection.indexOf(this.model);
    
    this.bindTo(this.model, "stop", this.stop);
    this.bindTo(this.model, "play", this.play);

    this.state = options.state;
    // this.vent = options.vent;

    console.log(this.model);

  },

  events: {
    "hover.validator": "showPlay",
    "hover.options": "showOptions",
    "mouseleave.options": "hideOptions",
    "mouseleave.validator": "hidePlay",
    "click.heart .album .heart": "love",
    "click.validator .album .play": "clickPlay",
    "click.delete .album .delete": "delete",
  },

  render: function () {
    var self = this;

    // Check to see if album view or list view should be rendered
    var width = $("#center").width();
    if (width < 565) {
      console.log(this.model);
      this.$el.addClass('album2').html(JST["songs/songlist"]({song: this.model, pid: this.model.collection.parent.id, index: this.index}));
    } else {
      this.$el.addClass('album').html(JST["songs/song"]({
        song: this.model, pid: this.model.collection.parent.id, index: this.index}
        ));
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
    if (this.state.id === "id-" + this.model.collection.parent.id + "-" + this.model.id) {
      this.$el.off(".validator");
      this.$el.on("click", ".stop", this.clickStop);
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
    $(".play", this.el).remove();
    this.$el.off(".validator");
    this.$el.append("<div class='stop'></div>");
    this.$el.on("click.validator", ".stop", this.clickStop);
    this.state.id = "id-" + this.model.collection.parent.id + "-" + this.model.id;
  },

  clickStop: function() {
    this.model.stop();
  },

  stop: function() {
    this.state.id = null;
    $(".stop", this.el).removeClass();
    this.refreshEvents();
  },
 
  refreshEvents: function() {
    this.$el.on("click.validator", ".play", this.clickPlay);
    this.$el.on("hover.validator", this.showPlay);
    this.$el.on("mouseleave.validator", this.hidePlay);
  },

  showOptions: function() {
    var self = this;
    $('.delete, .heart, .move, .buy', this.el).stop().fadeIn();
    $('.buy', this.el).draggable({ helper: function() {var clone = $('.footer',self.el).clone().addClass("draggable-song"); return clone;}, zIndex: 20000, appendTo: "body"});
  },

  hideOptions: function() {
    $(".delete, .heart, .move, .buy", this.el).hide(); 

  },

  love: function() {
    $(".heart").removeClass().addClass("love");
  },

  delete: function() {
    this.model.delete();
  }

});