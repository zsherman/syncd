object false

child @playlist => :playlists do
	attributes :id, :created_at, :updated_id, :name, :editable
	node (:count) { |playlist| playlist.songs.count }
	node (:songs) { }
	child :users => :subscribers do
	  attributes :uid
	end
end

child @invitations => :invitations do
	attributes :playlist_id, :inviter_uid, :playlist_name, :inviter_name
end


