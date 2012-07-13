Syncd.Views.PlaylistsIndex = Backbone.View.extend({
  initialize: function(options) {
    _.bindAll(this);
    this.vent = options.vent;
    this.collection.on("add", this.addNewPlaylist);
    this.collection.on("reset", this.render);
    this.collection.on("remove", this.destroyPlaylist);
    $('#left section.playlists a.create').click(this.newPlaylist); // Outside of the view element
    $('#left section.playlists a.delete').click(this.deletePlaylists); // Outside of the view element
  },

  events: {
    "click .playlists ul li": "setActive",
    "click .playlists ul li .delete-button": "deletePlaylist"
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

  deletePlaylist: function(eventName) {
    var id = $(eventName.currentTarget).data("id");
    var model = this.collection.get(id);
    var index = this.collection.indexOf(model);
    
    // Remove the playlist element from the view
    $(".index-"+index).remove();

    // Reorder indices
    $("[class^='index']").removeClass().each(function(index){
      $(this).addClass("index-"+index);
    });

    // Remove playlist element from the collection
    this.collection.remove(model);
  },

  destroyPlaylist: function(m, c, options) {
    m.destroy();
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
                    //router.navigate("playlists/" + id);
                    // Trigger event change for songs view
                    var model = self.collection.get(id);
                    model.fetch({success: function(model) {
                      self.vent.trigger("loadSongs", model.id);
                      }
                    });
                    // !!! Dry this code up into setActive function
    }});
  },

  setActive: function (eventName) {
    $(".active").removeClass("active");
    $(eventName.currentTarget).addClass('active');
    var id = $(eventName.currentTarget).children().data("id");
    //router.navigate("playlists/" + id);

    // Trigger event change for songs view
    var self = this;
    var model = this.collection.get(id);

    // New behavior to be implemented: If model.songs is not an empty collection,
    // fetch the songs, and trigger loadSongs. A master collection containing these
    // song collections has to be created. OR... you can pass in the playlist collection
    // and find the song collection that needs to be viewed by inspecting the right model
    if (model.get("songs") === null) {
      model.fetch({success: function(model) {
        self.vent.trigger("loadSongs", model.id);
        }
      });
    } else {
      self.vent.trigger("loadSongs", model.id);
    }
  }

});

