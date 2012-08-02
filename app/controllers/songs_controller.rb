class SongsController < ApplicationController
	before_filter :authenticate_user!
  	respond_to :json

	def update
		song = Playlist.find(params[:playlist_id]).songs.exists?(params[:id])
		if !(song)
			playlist = Playlist.find(params[:playlist_id]).songs << Song.find(params[:id])
			@playlist = Playlist.find_by_id(params[:playlist_id])
			respond_with(@playlist)
		end		
	end

	def destroy
		playlist = Playlist.find(params[:playlist_id]).songs.delete(Song.find(params[:id]))
		respond_with(playlist)
	end

	def show
	end

end
