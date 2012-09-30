object @user
	attributes :first_name, :last_name

child :playlists => :playlists do
	attributes :name
end