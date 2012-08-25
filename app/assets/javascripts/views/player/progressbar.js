Syncd.Views.ProgressBar = Backbone.View.extend({

  initialize: function(options) {
    _.bindAll(this);
    Syncd.vent.bindTo("play", this.createTimer);
    Syncd.vent.bindTo("pause", this.stopTimer);
  },
  
  template: "player/progressbar",

  events: {
  },
  
  render: function(id) {
    self = this;
    var state = {
      length: "0:00",
      position: "0:00",
      percent: "0%",
      display: "none"
    }
    this.$el.html(JST[this.template]({state: state}));
    $(".bar", this.el).slider({
      start: function(event, ui) { self.stopTimer(); },
      slide: function(event, ui) { self.slide(ui) },
      stop: function(event, ui) { self.createTimer(self.model, ui.value) }
    });
  },

  createTimer: function(model, pos) {
    console.log(pos);
    // Set the model on the view
    this.model = model;

    // Get the model's sound object and create a partial function
    // If pos (position) is set, then update the position of the sound object
    var sound = soundManager.getSoundById(model.soundObject_id);
    var updateDOM = partial(this.parseTime, sound);
    if (typeof pos != "undefined") { sound.setPosition(Math.floor(pos/100*sound.durationEstimate)) }

    // If a timer already exists, remove it
    if (this.timer) {
      this.stopTimer();
    }
    
    // Create a new timer
    this.timer = setInterval(updateDOM, 1000);

    // Partial function
    function partial(func /*, 0..n args */) {
      var args = Array.prototype.slice.call(arguments, 1);
      return function() {
        var allArguments = args.concat(Array.prototype.slice.call(arguments));
        return func.apply(this, allArguments);
      };
    }
  },

  stopTimer: function() {
    clearInterval(this.timer);
  },

  parseTime: function(sound) {
    var percent = 100*sound.position/sound.durationEstimate+"%";
    $(".current", this.el).html(this.calcTime(sound.position));
    $(".end", this.el).html( this.calcTime(sound.durationEstimate));
    $(".bar-filled", this.el).css("width", percent);
    $(".ui-slider-handle", this.el).css({"left": percent, "display": "block"});
  },

  calcTime: function(num) {
    var minutes = Math.floor(num/1000/60);
    var seconds = Math.floor(num/1000 % 60);
    if (seconds < 10) {
      seconds = "0"+seconds.toString();
    }
    return minutes+":"+seconds;
  },

  slide: function(ui) {
    // Get sound object
    var sound = soundManager.getSoundById(this.model.soundObject_id);

    // Update to the position you seek
    $(".current", this.el).html(this.calcTime(ui.value/100*sound.durationEstimate));
    $(".bar-filled", this.el).css("width", ui.value+"%");
  }

});