class AddTypeToAlbums < ActiveRecord::Migration
  def change
    add_column :albums, :type, :string
  end
end
