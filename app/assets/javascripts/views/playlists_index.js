Syncd.Views.PlaylistsIndex = Backbone.View.extend({
  initialize: function(options) {
    _.bindAll(this);
    this.vent = options.vent;
    this.collection.on("add", this.render);
    this.collection.on("reset", this.render);
    $('#left section.playlists a').click(this.newPlaylist); // Outside of the view element
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
    this.collection.each(function(pl) {
      var playlist = new Syncd.Views.Playlist({ model: pl, collection: self.collection });
      self.$el.append(playlist.render().el);
    });
  },

  newPlaylist: function () {
    var self = this;
    var newPlaylistModel = new Syncd.Models.Playlist({name: "Untitled"});
    newPlaylistModel.save({}, {
        success: function(model, response) {
                    // Add new playlist to collection
                    self.collection.add(newPlaylistModel);
                    // Highlight the new playlist and change the URL
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
    childLists = eventName.currentTarget.parentElement.children;
    var len = childLists.length;
    for (var i = 0, len = childLists.length; i < len; i++) {  
      $(childLists[i]).removeClass('active');
    } 
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




