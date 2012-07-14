Syncd.Views.SongsIndex = Backbone.Marionette.CollectionView.extend({

  itemView: Syncd.Views.Song,

  emptyView: Syncd.Views.NoSongs,

  initialize: function(options) {
    _.bindAll(this);
    this.state = options.state;
    this.collection = options.collection;

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

    //this.collection = (mid) ? this.playlists.get(mid).songs : new Syncd.Collections.Songs({});
  
    //this.bindTo(this.collection, "remove", function() {alert("test")});
  },

  renderSongs: function (id) {
    //this.mid = id;
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

