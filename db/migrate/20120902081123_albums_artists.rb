class AlbumsArtists < ActiveRecord::Migration
  def up
  	create_table :albums_artists, :id => false do |t|
      t.integer :album_id
      t.integer :artist_id
    end
  end

  def down
  end
end
