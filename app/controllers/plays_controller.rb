class PlaysController < ApplicationController
	respond_to :json

	def create
		@user = current_user
		logger.info params[:id]
		@song = Song.find(params[:song][:id])
		logger.info @song
		@play.new(:user_id => @user.id, :song_id => @song.id)
		@play.save
	end

end
