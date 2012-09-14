class RemoveTypeFromAlbums < ActiveRecord::Migration
  def up
    remove_column :albums, :type
  end

  def down
  end
end
