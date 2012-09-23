Syncd.Models.Artist = Backbone.RelationalModel.extend({
    relations: [{
        type: Backbone.HasMany,
        key: 'albums',
        relatedModel: 'Syncd.Models.Album',
        collectionType: 'Syncd.Collections.Albums',
        reverseRelation: {
            key: 'artist'
        }
    }]
});