Syncd.Views.Song = Backbone.Marionette.ItemView.extend({

  initialize: function(options) {
    _.bindAll(this);

    // Make unselectable
    this.$el.attr('unselectable', 'on');
    this.$el.css('user-select', 'none');
    
    this.bindTo(this.model, "stop", this.stop);
    this.bindTo(this.model, "play", this.play);

    this.state = Syncd.state;
    this.index = this.model.collection.indexOf(this.model);

  },

  events: function() {
    if (this.state.songsview.resize == "album" && this.state.songsview.toggle == "album") {
      return {
        "hover.validator": "showPlay",
        "hover.options": "showOptions",
        "mouseleave.options": "hideOptions",
        "mouseleave.validator": "hidePlay",
        "click.heart .album .heart": "love",
        "click.validator .album .play": "clickPlay",
        "click.delete .album .delete": "delete",
      }
    } else {
      return {
        "dblclick.list": "clickPlay",
        "click.list": "highlight"
      }
    }
  },

  render: function () {
    var self = this;

    // Check to see if album view or list view should be rendered
    if (this.state.songsview.resize == "list" || this.state.songsview.toggle == "list") {
      this.$el.addClass('list').html(JST["songs/songlist"]({song: this.model, pid: this.model.collection.parent.id, index: this.index}));
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
      if (this.state.songsview.resize == "album" && this.state.songsview.toggle == "album") {
        this.$el.off(".validator");
        this.$el.on("click", ".stop", this.clickStop);
        this.$el.append("<div class='stop'></div>");
      } else {
        this.$el.off("dblclick.list");
        this.$el.on("dblclick", this.clickStop);
        $('.status',this.el).addClass("playing");
      }
    }

    if (this.state.songsview.highlighted[this.model.collection.parent.id] == this.model.id) {
      this.$el.addClass("active");
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

  highlight: function() {
    $(".list:not(.bar)").removeClass("active");
    this.$el.addClass("active");
    this.state.songsview.highlighted[this.model.collection.parent.id] = this.model.id; 
  },

  play: function() {
    if (this.state.songsview.toggle == "list" || this.state.songsview.resize == "list") {
      $(".status", this.el).addClass("playing");
      this.$el.off("dblclick.list");
      this.$el.on("dblclick", this.clickStop);
    } else {
      $(".play", this.el).remove();
      this.$el.off(".validator");
      this.$el.append("<div class='stop'></div>");
      this.$el.on("click.validator", ".stop", this.clickStop);
    }
    this.state.id = "id-" + this.model.collection.parent.id + "-" + this.model.id;
  },

  clickStop: function() {
    this.model.stop();
  },

  stop: function() {
    if (this.state.songsview.toggle == "list" || this.state.songsview.resize == "list") {
      $('.status',this.el).removeClass("playing");
      this.$el.off("dblclick");
      this.$el.on("dblclick.list", this.clickPlay);
    } else {
      $(".stop", this.el).removeClass();
      this.refreshEvents();
    }
    this.state.id = null;
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