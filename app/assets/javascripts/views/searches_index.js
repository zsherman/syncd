Syncd.Views.SearchesIndex = Backbone.Marionette.CollectionView.extend({

	itemView: Syncd.Views.SearchedSong

	initialize: function() {
		var _self = this;
		_.bindAll(this);
		$('#top .search').on("keypress", function(e) {
	      if(e.keyCode==13){
	        _self.render();
	      }
	    });
	    //set collection
	},

	render: function () {
        _.each(this.collection.models, function (song) {
            this.renderSong(song);
        }, this);
    },

    renderSong: function (song) {
        var songView = new SearchedSong({
            model: song
        });
        this.$el.append(songView.render().el);
    }

	
});