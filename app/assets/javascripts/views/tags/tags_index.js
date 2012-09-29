Syncd.Views.TagsIndex = Backbone.Marionette.CollectionView.extend({

	itemView: Syncd.Views.Tag,

	initialize: function(options) {
		this.collection = options.collection;
		var self = this;
	},

	onRender: function() {
		var self = this;
		$("#tag_form").html('<input id="add_tag" placeholder="Add a tag" />');
		var availableTags = [
			"Sweet",
			"Dude"
		];
		$( "#add_tag" ).autocomplete({
			source: availableTags
		});
		$('#tag_form').keypress(function (e) {
	  		if (e.which == 13) {
	    		self.addTag();
	  		}
		});
	},

	onClose: function() {
		$('#tag_form').off("keypress");
	},

	addTag: function() {
		var self = this;
		console.log(this.collection.parent.id);
		console.log("enter was pressed");
		var tag_input = $("#add_tag").val();
		var tag = new Syncd.Models.Tag({
			name: tag_input,
			playlist: this.collection.parent.id
		});
		tag.save(null, {success: function(model) {
			console.log(model);
			self.collection.add(model);
			console.log(model.id);
		}});
		$('#add_tag').val('');
	}

});