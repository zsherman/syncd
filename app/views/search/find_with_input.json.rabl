object false

child @artist => :artists do
	attributes :id, :name
	child :albums => :albums do
	  attributes :id, :name, :list_type, :release_date
	  child :songs => :songs do 
	  	attributes :id, :title, :image, :audio
	  end
	end
end