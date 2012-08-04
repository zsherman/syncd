class CreatePlaylistsUsersTable < ActiveRecord::Migration
  def change
    create_table :playlists_users, :id => false do |t|
      t.integer :user_id
      t.integer :playlist_id
    end
  end
end
