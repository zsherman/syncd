object false 

child @playlist.songs do |song|
	attributes :id, :title, :artist, :audio, :image
end

child @playlist.users => :subscribers do
  	attributes :uid
end

node (:count) { |playlist| @playlist.songs.count }