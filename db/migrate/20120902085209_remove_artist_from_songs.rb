class RemoveArtistFromSongs < ActiveRecord::Migration
  def up
    remove_column :songs, :artist
      end

  def down
    add_column :songs, :artist, :string
  end
end
