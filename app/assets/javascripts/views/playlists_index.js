Syncd.Views.PlaylistsIndex = Backbone.View.extend({
  initialize: function(options) {
    _.bindAll(this);
    this.vent = options.vent;
    this.collection.on("add", this.addNewPlaylist);
    this.collection.on("reset", this.render);
    //this.collection.on("remove", function(model, collection, options) {console.log(options)});
    $('#left section.playlists a.create').click(this.newPlaylist); // Outside of the view element
    $('#left section.playlists a.delete').click(this.deletePlaylists); // Outside of the view element
  },

  events: {
    "click .playlists ul li": "setActive"
  },

  render: function () {
    this.$el.html("");
    this.renderPlaylists();
    return this;
  }, 

  renderPlaylists: function() {
    var self = this;
    this.collection.each(function(model, index) {
      var playlist = new Syncd.Views.Playlist({ model: model, collection: self.collection, vent: self.vent });
      self.$el.append(playlist.render().$el.addClass("index-"+index));
    });
  },

  addNewPlaylist: function(model, collection, options) {
    var playlist = new Syncd.Views.Playlist({ model: model, collection: this.collection, vent: this.vent });
    this.$el.append(playlist.render().$el.addClass("index-"+options.index));
  },

  deletePlaylists: function() {
    this.vent.trigger("deletePL");
  },

  newPlaylist: function () {
    var self = this;
    var newPlaylistModel = new Syncd.Models.Playlist({name: "Untitled"});
    newPlaylistModel.save({}, {
        success: function(model, response) {
                    // Add new playlist to collection
                    self.collection.add(newPlaylistModel);
                    // Highlight the new playlist and change the URL
                    $(".active").removeClass("active");
                    var LI = $("li", self.el).last();
                    var id = LI.children().data("id");
                    LI.addClass("active");
                    router.navigate("playlists/" + id);
                    var model = this.collection.get(id);
                    this.vent.trigger("updateSongs", model.songs);
                    // !!! Dry this code up into setActive function
    }});
  },

  setActive: function (eventName) {
    $(".active").removeClass("active");
    $(eventName.currentTarget).addClass('active');
    var id = $(eventName.currentTarget).children().data("id");
    router.navigate("playlists/" + id);

    // Trigger event change for songs view
    var model = this.collection.get(id);
    this.vent.trigger("updateSongs", model.songs);
  }

});





// NOTE: Can refresh the playlists (and the songs they contain) by calling
// this.collection.fetch();




