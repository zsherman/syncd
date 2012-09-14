class AddListTypeToAlbums < ActiveRecord::Migration
  def change
    add_column :albums, :list_type, :string
  end
end
