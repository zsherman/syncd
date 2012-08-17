class RemoveUserIdFromPlaylist < ActiveRecord::Migration
  def up
    remove_column :playlists, :user_id
      end

  def down
    add_column :playlists, :user_id, :integer
  end
end
