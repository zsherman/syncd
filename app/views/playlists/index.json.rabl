object false

child @playlist => :playlists do
	attributes :id, :created_at, :updated_id, :name, :editable
	node (:count) { |playlist| playlist.songs.count }
	child @pending_invitations => :subscribers do
		attributes :uid, :name
	end
end

child @invitations => :invitations do
	attributes :id, :playlist_id, :inviter_uid, :playlist_name, :inviter_name
end


