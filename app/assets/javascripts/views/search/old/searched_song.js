Syncd.Views.SearchedSong = Backbone.Marionette.ItemView.extend({

  initialize: function() {
    //_.bindAll(this);
    //this.model.initSongsonce();
    this.index = this.model.collection.indexOf(this.model);
  },

  template: "searches/searched_song",

  serializeData: function(){
    var json = this.model.toJSON();
    json.playlists = Syncd.Instances.PlaylistCollection.toJSON();
    console.log(json);
    return json;
  },

  events: {
  	"click.searched_song .play_search": "clickPlay",
  	"click.searched_song .stop_search": "clickStop",
    "change .add_to_playlist": "addToPlaylist"
  },

  clickPlay: function() {
  	this.model.play();
  },

  clickStop: function() {
  	this.model.stop();
  },

  play: function() {

  },

  stop: function() {

  },

  addToPlaylist: function(data) {
    var playlist_id = $("select option:selected", this.el).val();
    //var playlist_id = data.currentTarget.selectedOptions[0].value;
    var songModel = this.model.clone();
    var playlist = Syncd.Instances.PlaylistCollection.get(playlist_id);

    var addAndSave = function() {
      playlist.get("songs").add(songModel);
      songModel.initSongs();
      songModel.save();
    }

    if (playlist.get("fetched") === false) {
      playlist.fetch({success: function(model) {
          addAndSave();
        }
      });
    } else {
      addAndSave();
    }

  }

});