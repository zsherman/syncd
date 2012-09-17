Syncd.Views.SongsIndex = Backbone.Marionette.CollectionView.extend({

  itemView: Syncd.Views.Song,

  emptyView: Syncd.Views.NoSongs,

  initialize: function(options) {
    _.bindAll(this); 
    this.collection = options.collection;

    // Create a function that throttles the render function (which is called on resize)
    var resizeThrottle = _.throttle(this.resizeSongs, 1500);
    $(window).resize(resizeThrottle);
    
    // Make the albums and lists sortable
    this.$el.sortable({placeholder: 'sortable-placeholder', disabled: true});

    // Bind to album/list view global event
    Syncd.vent.bindTo("songsview.toggle:updated", this.render);

  },

  itemViewOptions: function() {
    var self = this;
  },

  events: {
  },

  onRender: function(){
    var width = $("#center").width();

    // Remove bar (with name, artist, etc) if it exists, and prepend a new one
    $('.bar', this.el).remove();

    // Determine if the songs should be sortable 
    if (width < 565 || Syncd.state.songsview.toggle == "list") {
      this.$el.sortable( "option", "disabled", true );
      this.$el.prepend('<div class="list bar"><div class="footer"><span class="title">Name</span><span class="artist">Artist</span></div></div>');

    } else {
      this.$el.sortable( "option", "disabled", false );
    }

  },

  resizeSongs: function () {
    var width = $("#center").width();

    if (width < 565) {
      Syncd.state.songsview.resize = "list";
    } else if (Syncd.state.songsview != "list") {
      Syncd.state.songsview.resize = "album";
    }

    this.render();
  }
  
});

