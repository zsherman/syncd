Syncd.Views.SubscribersIndex = Backbone.Marionette.CollectionView.extend({

	initialize: function() {
		_.bindAll(this);
		this.$el.on("click", "#friendsearch", this.createAutosuggest);
	},

 	itemView: Syncd.Views.Subscriber,

	className: "fb-image-container",

 	onRender: function(){
  		var length = this.collection.length;
  		length += (length == 1) ? " subscriber" : " subscribers";
    	this.$el.prepend('<div class="num-subscribers">'+length+'</div>');
    	this.$el.append('<input id="friendsearch" value="Add a friend" />');
  	},

  	createAutosuggest: function() {
  		var _self = this;
  		var friends = JSON.parse(localStorage.getItem("friends"));
  		var names = [];
  		_.each(friends, function(value, key) {
  			names[key] = value["name"];
  		});
  		$("#friendsearch").autocomplete({
			source: names,
			select: function(event, ui) { 
				var friend_name = ui.item.value;
				var uid = _.find(friends, function(obj){ return obj.name == friend_name; }).id.replace(/"/g, '');
				var new_subscriber = new Syncd.Models.Subscriber({
				  uid: uid,
				  playlist_id: _self.collection.parent.id
				});
				//_self.collection.add(new_subscriber);
				new_subscriber.save();
			}
		});
  	}
});