class CreateAlbums < ActiveRecord::Migration
  def change
    create_table :albums do |t|
      t.string :name
      t.datetime :release_date
      t.string :artwork

      t.timestamps
    end
  end
end
