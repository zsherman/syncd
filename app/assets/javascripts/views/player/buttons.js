Syncd.Views.Buttons = Backbone.View.extend({

  initialize: function(options) {
    _.bindAll(this);
    Syncd.vent.bindTo("play", this.showPause);
    Syncd.vent.bindTo("pause", this.showPlay);
  },
  
  template: "player/buttons",

  events: {
    "click .play": "play",
    "click .pause": "pause"
  },
  
  render: function(state) {
    state = state || "play";
    this.$el.html(JST[this.template]({state: state}));
  },

  showPause: function(model) {
    this.model = model;
    this.render("pause");
  },

  showPlay: function(model) {
    this.model = model;
    this.render("play");
  },

  play: function(){
    this.model.play();
  },

  pause: function() {
    this.model.stop();
  }

});