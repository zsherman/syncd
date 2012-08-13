class SongsController < ApplicationController
	before_filter :authenticate_user!
  	respond_to :json

	def update
		@playlist = Playlist.find_by_id(params[:playlist_id])
		songlist = @playlist.songs
		if !(songlist.exists?(params[:id]))
			song = Song.find(params[:id])
			songlist << song

			# Notify faye that song has been added to playlist
			Song.notify_observers(:custom_after_create, song, params[:playlist_id])
			respond_with(@playlist)
		end
	end

	def destroy
		songlist = Playlist.find(params[:playlist_id]).songs
		song = Song.find(params[:id])
		songlist.delete(song)

		# Notify faye that song has been deleted from playlist
		Song.notify_observers(:custom_after_destroy, song, params[:playlist_id])
		respond_with("success")
	end

	def show
	end

end
