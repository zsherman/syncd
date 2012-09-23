Syncd.Views.SearchesIndex = Backbone.Marionette.CollectionView.extend({

	itemView: Syncd.Views.SearchedSong,

	initialize: function(options) {
		_.bindAll(this);
		var _self = this;

		this.collection = options.collection;
		this.collection.fetch();

		$('#top .search').on("keypress", function(e) {
	      if(e.keyCode==13){
	      	_self.collection.fetch();
	        _self.render();
	      }
	    });
	}
	
});