Syncd.Views.PlaylistsIndex = Backbone.View.extend({
  initialize: function(options) {
    _.bindAll(this);
    this.state = _.extend({}, Backbone.Events);
    this.vent = options.vent;
    this.collection.on("add", this.addNewPlaylist);
    this.collection.on("reset", this.render);
    this.collection.on("remove", this.destroyPlaylist);
    this.collection.on("change:name", this.updateName);
    $('#left section.playlists header .add').click(this.newPlaylist); // Outside of the view element
    $('#left section.playlists a.delete').click(this.deletePlaylists); // Outside of the view element
    $('#left section.music li').click(this.showMusic);
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
      if (model.get("editable") === null) {
        var playlist = new Syncd.Views.Playlist({ model: model, collection: self.collection, vent: self.vent });
        self.$el.append(playlist.render().$el.addClass("index-"+index));
      }
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
    this.collection.remove(model, {silent: true});
    model.destroy();
  },

  destroyPlaylist: function(model, collection, options) {
    var id = model.id;
    $('*[data-id="'+id+'"]').parent().remove();

    // Reorder indices
    $("[class^='index']").removeClass().each(function(index){
      $(this).addClass("index-"+index);
    });

    model.destroy();
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
                    console.log(model);
                    var model = self.collection.get(id);
                    model.fetch({success: function(model) {
                      self.renderRegions(model)
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
    console.log(model.get("songs"));
    if (model.get("songs").length === 0) {
      model.fetch({success: function(model) {
        
        self.renderRegions(model);
        }
      });
    } else {
      self.renderRegions(model);
    }


  },

  showMusic: function() {
    var self = this;
    $(".active").removeClass("active");
    $("#left section.music li").addClass("active");
    var id = _.first(this.collection.where({editable: true})).id;
    var model = this.collection.get(id);
    if (model.get("songs").length === 0) {
      model.fetch({success: function(model) {
        self.renderRegions(model);
        }
      });
    } else {
      self.renderRegions(model);
    }
  },

  renderRegions: function(model, state) {
    var songsView = new Syncd.Views.SongsIndex({collection: model.get("songs"), state: this.state});
    Syncd.centerRegion.show(songsView);
    var infoPane = new Syncd.Views.SubscribersIndex({collection: model.get("subscribers")});
    Syncd.rightRegion.show(infoPane);
  },

  updateName: function(model) {
    var name = model.get("name");
    this.collection.get(model.id).set(name);
  }

});

