class CreateArtistsSongsTable < ActiveRecord::Migration
  def up
  	create_table :artists_songs, :id => false do |t|
      t.integer :artist_id
      t.integer :song_id
    end
  end


  def down
  end
end
