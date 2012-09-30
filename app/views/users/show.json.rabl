object @user
	attributes :first_name, :last_name, :email

child :playlists => :playlists do
	attributes :name
end