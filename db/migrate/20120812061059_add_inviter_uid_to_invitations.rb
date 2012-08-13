class AddInviterUidToInvitations < ActiveRecord::Migration
  def change
    add_column :invitations, :inviter_uid, :integer
  end
end
