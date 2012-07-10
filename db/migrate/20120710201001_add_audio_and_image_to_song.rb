class AddAudioAndImageToSong < ActiveRecord::Migration
  def change
    add_column :songs, :audio, :string
    add_column :songs, :image, :string
  end
end
