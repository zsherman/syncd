Syncd.Views.SongsIndex = Backbone.Marionette.CollectionView.extend({

  itemView: Syncd.Views.Song,

  emptyView: Syncd.Views.NoSongs,

  initialize: function(options) {
    _.bindAll(this);
    this.state = _.extend({}, Backbone.Events);
    this.vent = options.vent;
    this.playlists = options.playlists;
    this.vent.on("loadSongs", this.renderSongs);
    //this.bindTo(window.Syncd.playlists, "stateChange", this.updateState);
    $(window).resize(this.resizeSongs);
  },

  itemViewOptions: function() {
    var self = this;
    var obj = {vent: self.vent, state: self.state};
    return obj;
  },

  events: {
  },

  beforeRender: function(){
    var mid = this.mid
    this.collection = (mid) ? this.playlists.get(mid).songs : new Syncd.Collections.Songs({});
  },

  renderSongs: function (id) {
    this.mid = id;
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

