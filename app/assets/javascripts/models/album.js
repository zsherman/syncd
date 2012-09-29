Syncd.Models.Album = Backbone.RelationalModel.extend({
    relations: [{
        type: Backbone.HasMany,
        key: 'songs',
        relatedModel: 'Syncd.Models.SongRelational',
        collectionType: 'Syncd.Collections.Songs',
        reverseRelation: {
            key: 'album'
        }
    }]
});