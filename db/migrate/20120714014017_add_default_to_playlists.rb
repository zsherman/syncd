class AddDefaultToPlaylists < ActiveRecord::Migration
  def change
    add_column :playlists, :default, :boolean
  end
end
