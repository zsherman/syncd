Syncd.Views.SubscribersIndex = Backbone.Marionette.CollectionView.extend({
  itemView: Syncd.Views.Subscriber,
  className: "fb-image-container",
  onRender: function(){
  	var length = this.collection.length;
  	length += (length == 1) ? " subscriber" : " subscribers";
    this.$el.prepend('<div class="num-subscribers">'+length+'</div>');
    this.$el.append('<div class="add-subscriber"></div>')
  }
});