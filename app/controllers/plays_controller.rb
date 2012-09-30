class PlaysController < ApplicationController
	respond_to :json

	def create
		@user = current_user
		logger.info params[:id]
		@song = Song.find(params[:id])
		logger.info @song
		Play.create(:user_id => @user.id, :song_id => @song.id)
		render :nothing
	end

end
