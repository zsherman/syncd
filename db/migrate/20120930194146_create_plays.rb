class CreatePlays < ActiveRecord::Migration
  def change
    create_table :plays do |t|
      t.integer :user_id
      t.integer :song_id
      t.timestamps
    end
  end
end
