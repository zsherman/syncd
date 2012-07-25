Syncd.Views.SongsIndex = Backbone.Marionette.CollectionView.extend({

  itemView: Syncd.Views.Song,

  emptyView: Syncd.Views.NoSongs,

  initialize: function(options) {
    _.bindAll(this); 
    this.state = options.state;
    this.collection = options.collection;
    var resizeThrottle = _.throttle(this.render, 1500);
    $(window).resize(resizeThrottle);
  },

  itemViewOptions: function() {
    var self = this;
    var obj = {vent: self.vent, state: self.state};
    return obj;
  },

  events: {
  },

  onRender: function(){
    this.$el.sortable({placeholder: 'sortable-placeholder'});

    //this.collection = (mid) ? this.playlists.get(mid).songs : new Syncd.Collections.Songs({});
  
    //this.bindTo(this.collection, "remove", function() {alert("test")});
  },

  renderSongs: function (id) {
    this.render();
  },

  resizeSongs: function () {
    this.render();
  },

  updateState: function(id) {
    this.state.id = id;
    console.log(this.state.id);
  }
});

