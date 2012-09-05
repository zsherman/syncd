class CreateAlbumsSongsTable < ActiveRecord::Migration
  def up
  	create_table :albums_songs, :id => false do |t|
      t.integer :album_id
      t.integer :song_id
    end
  end

  def down
  end
end
