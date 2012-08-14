Syncd.Views.SearchesIndex = Backbone.Marionette.CollectionView.extend({

	initialize: function() {
		var _self = this;
		_.bindAll(this);
		$('#top .search').on("keypress", function(e) {
	      if(e.keyCode==13){
	        _self.render();
	      }
	    });
	},

 	itemView: Syncd.Views.SearchedSong
	
});