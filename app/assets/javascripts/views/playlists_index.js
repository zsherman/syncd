Syncd.Views.PlaylistsIndex = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, "render", "newPlaylist", "renderNewPlaylist");
    this.collection.on("add", this.renderNewPlaylist);
    $('#left section.playlists a').click(this.newPlaylist);
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
      var playlist = new Syncd.Views.Playlist({ model: pl });
      self.$el.append(playlist.render().el);
    });
  },

  renderNewPlaylist: function(eventName) {
    this.render();
    $("li", this.el).last().addClass("active");
    console.log($(this.el).last());
  },

  newPlaylist: function() {
    this.collection.add({id:2, name: "Untitled"});
  },

  setActive: function (eventName) {
    childLists = eventName.currentTarget.parentElement.children;
    var len = childLists.length;
    for (var i = 0, len = childLists.length; i < len; i++) {  
      $(childLists[i]).removeClass('active');
    } 
    $(eventName.currentTarget).addClass('active');
  }

});