class SubscribersController < ApplicationController
	before_filter :authenticate_user!
	respond_to :json

	def create
		# Get user to be added
		user_to_be_added = User.find_by_uid(params[:uid])

		# Create a new invitation for the user to be added
		playlist = Playlist.find_by_id(params[:playlist_id])
		playlist.invitations.find_or_create_by_uid_and_inviter_uid(:uid => params[:uid], :inviter_uid => current_user.uid)
		respond_with("success")

		# If user to be added currently exists, send out a notification 
		# that they have been added to a playlist

		# If user does not currently exist, post to their facebook wall
		# notifying them that they have been added to a playlist and
		# should create an account 

	end
end
