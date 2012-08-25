Syncd.Views.ProgressBar = Backbone.View.extend({

  initialize: function(options) {
    _.bindAll(this);
    Syncd.vent.bindTo("play", this.createTimer);
    Syncd.vent.bindTo("pause", this.stopTimer);
    //$(".progress-bar .bar").slider();
  },
  
  template: "player/progressbar",

  events: {
  },
  
  render: function(id) {
    var state;
    if (typeof id != "undefined") {
      var sound = soundManager.getSoundById(id);
      state = this.parseTime(sound);
    } else {
      state = {
        length: "0:00",
        position: "0:00",
        percent: "0%",
        display: "none"
      }
    }
    this.$el.html(JST[this.template]({state: state}));
  },

  createTimer: function(model) {
    function partial(func /*, 0..n args */) {
      var args = Array.prototype.slice.call(arguments, 1);
      return function() {
        var allArguments = args.concat(Array.prototype.slice.call(arguments));
        return func.apply(this, allArguments);
      };
    }

    var id = model.soundObject_id;
    var render = partial(this.render, id);
    if (this.timer) {
      this.stopTimer();
    }
    render();
    this.timer = setInterval(render, 1000);
  },

  stopTimer: function() {
    clearInterval(this.timer);
  },

  parseTime: function(sound) {
    return state = {
        length: this.calcTime(sound.durationEstimate),
        position: this.calcTime(sound.position),
        percent: 100*sound.position/sound.durationEstimate+"%",
        display: "block"
    }
  },

  calcTime: function(num) {
    var minutes = Math.floor(num/1000/60);
    var seconds = Math.floor(num/1000 % 60);
    if (seconds < 10) {
      seconds = "0"+seconds.toString();
    }
    return minutes+":"+seconds;
  }

});