collection @playlist.songs :root => false, :object_root => false
	attributes :title, :artist, :audio, :image, :album
	node do |u|
	  { :id => @playlist.id.to_s + "-" + u.id.to_s }
	end
	node do |u|
	  { :s_id => u.id.to_s }
	end