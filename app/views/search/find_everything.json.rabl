object false 

child @songs do |song|
	attributes :id, :title, :artist, :audio, :image
end

child @artists do
  	attributes :id, :name, :mbid
end

child @albums do
  	attributes :id, :name, :release_date, :artist
end
