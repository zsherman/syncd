object false 

child @playlist.songs do |song|
	attributes :id, :title, :artist, :audio, :image, :album
end

child @playlist.users => :subscribed do
  	attributes :uid
  	node do |u|
	  { :name => u.first_name + " " + u.last_name }
	end
end

child @pending_invitations => :pending do
	attributes :uid, :name
end

node (:count) { |playlist| @playlist.songs.count }