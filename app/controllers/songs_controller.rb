class SongsController < ApplicationController
	before_filter :authenticate_user!
  	respond_to :json

  	def index
  		@playlist = Playlist.find_by_id(params[:playlist_id])
  	end

	def update
		@playlist = Playlist.find_by_id(params[:playlist_id])
		songlist = @playlist.songs
		id = params[:id].match('-(\d+)')[1]
		if !(songlist.exists?(id))
			@song = Song.find(id)
			songlist << @song

			# Notify faye that song has been added to playlist
			Song.notify_observers(:custom_after_create, @song, params[:playlist_id])
		end
	end

	def show
		@playlist = Playlist.find_by_id(params[:playlist_id])
		songlist = @playlist.songs
		id = params[:id].match('-(\d+)')[1]
		@song = Song.find(id)
	end

	def destroy
		songlist = Playlist.find(params[:playlist_id]).songs
		id = params[:id].match('-(\d+)')[1]
		song = Song.find(id)
		songlist.delete(song)

		# Notify faye that song has been deleted from playlist
		Song.notify_observers(:custom_after_destroy, song, params[:playlist_id])
		respond_with("success")
	end


end
