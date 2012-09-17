object false 

child @playlist.songs do |song|
	attributes :id, :title, :artist, :audio, :image, :album
end

child @pending_invitations => :subscribers do
	attributes :uid, :name
end

child @playlist.users => :subscribers do
  	attributes :uid
  	node do |u|
	  { :name => u.first_name + " " + u.last_name }
	end
end

node (:count) { |playlist| @playlist.songs.count }

glue @playlist do
	attributes :id, :created_at, :updated_id, :name, :editable
end