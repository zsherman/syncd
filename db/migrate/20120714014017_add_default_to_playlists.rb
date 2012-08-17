class AddDefaultToPlaylists < ActiveRecord::Migration
  def change
    add_column :playlists, :editable, :boolean
  end
end
