Syncd.Models.Playlist = Backbone.RelationalModel.extend({

  relations: [
        {
            type: Backbone.HasMany, 
            key: 'songs',
            relatedModel: 'Syncd.Models.Song',
            collectionType: 'Syncd.Collections.Songs',
            reverseRelation: {
                key: 'playlist'
            }
        },
        {
            type: Backbone.HasMany, 
            key: 'subscribers',
            relatedModel: 'Syncd.Models.Subscriber',
            collectionType: 'Syncd.Collections.Subscribers',
            reverseRelation: {
                key: 'playlist'
            }
        }
  ],
  
  initialize: function() {
    _.bindAll(this);
    var _self = this;

    // Initialize faye subscriber
    new BackboneSync.RailsFayeSubscriber(this.get("songs"), {
        channel: 'songs'+this.id,
        client: faye
    });

    // Add a listener 
    this.get("songs").on("add", function(model) {
      // When a song is added to a playlist through faye, make sure that the playlist's songs
      // have been fetched. If the songs are not fetched, a song will be added to an empty collection (NOT GOOD)
      if (_self.get("songs").length == 0) {
        _self.get("songs").fetch();
      }
      // If a soundObject_id does not exist on the model, then run initSongs
      if (!model.soundObject_id) {
        model.initSongs();
      }
    });
  },

  urlRoot: '/playlists',

  droppableFunc: function( event, ui ) {
    var _self = this;
    var s_id = $(ui.helper[0]).data("id");
    var old_pid = $(ui.helper[0]).data("pid");

    // Create a new instance of the song model
    var attrs = this.collection.get(old_pid).get("songs").get(s_id).attributes;
    attrs.id = this.id + "-" + s_id.match('-(.+)')[1];
    delete attrs.playlist

    // Only save if the model is a new instance
    if (!Syncd.Models.Song.findOrCreate(attrs.id)) {
      var songModel = Syncd.Models.Song.build(attrs);
      songModel.set({'playlist':this.id});
      songModel.save(null, {silent: true}); // For some reason, this is creating a new model with a different id (just the song id, not the "###-###" unique id)
    }
  }
});