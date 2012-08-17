class SubscribersController < ApplicationController
	before_filter :authenticate_user!
	respond_to :json

	def create
		# Get user to be added
		user_to_be_added = User.find_by_uid(params[:uid])

		# Create a new invitation for the user to be added
		playlist = Playlist.find_by_id(params[:playlist_id])
		invitation = playlist.invitations.find_or_create_by_uid_and_inviter_uid(:uid => params[:uid], :inviter_uid => current_user.uid)
		::Rails.logger.info(invitation.inviter_uid)

		# Send out a notification to faye
		Invitation.notify_observers(:custom_after_create, invitation, user_to_be_added.uid)

		respond_with(playlist)

		# If user to be added currently exists, send out a notification 
		# that they have been added to a playlist

		# If user does not currently exist, post to their facebook wall
		# notifying them that they have been added to a playlist and
		# should create an account 

	end

	def update
		if params[:status] == "accepted" 
			current_user.playlists << Playlist.find_by_id(params[:playlist_id])
		end
	end

	def destroy
		Invitation.find_by_uid_and_playlist_id(current_user.uid, params[:playlist_id]).delete
		respond_with("success")
	end
end
