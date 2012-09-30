Syncd.Views.SearchArtistIndex = Backbone.Marionette.CollectionView.extend({
  
  itemView: Syncd.Views.SearchArtist,

  onRender: function(){
    $('#center .search .containers .artists .number').html(this.collection.pagination.total_entries);
  }

});