class CreateInvitations < ActiveRecord::Migration
  def change
    create_table :invitations do |t|
      t.integer :uid
      t.integer :playlist_id

      t.timestamps
    end
  end
end
