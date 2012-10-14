object false
	
child @user => :user do 
	attributes :first_name, :last_name, :email

	child @playlists => :playlists do
		attributes :name, :id
	end

	child @followers => :followers do
		attributes :id, :first_name, :last_name
	end

	child @following => :following do
		attributes :id, :first_name, :last_name
	end

	child @plays => :plays do |play|
		attributes :created_at

		node do |u|
		  { :title => u.song.title }
		end

	end
end

