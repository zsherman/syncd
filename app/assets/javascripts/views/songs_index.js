Syncd.Views.SongsIndex = Backbone.Marionette.CollectionView.extend({

  itemView: Syncd.Views.Song,

  emptyView: Syncd.Views.NoSongs,

  initialize: function(options) {
    _.bindAll(this);
    this.state = _.extend({}, Backbone.Events);
    this.vent = options.vent;
    this.playlists = options.playlists;
    this.vent.on("loadSongs", this.renderSongs);
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

    // var self = this;
    // this.$el.html("");
    // this.playlists.get(id).get("songs").each(function(model,index) {
    //   self.songList[index] = new Syncd.Views.Song({model: model, index: index});
    //   self.$el.append(self.songList[index].render().el);
    // });
  },

  resizeSongs: function () {
    this.render();
  }
});

