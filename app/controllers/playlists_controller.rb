class PlaylistsController < ApplicationController
  before_filter :authenticate_user!
  respond_to :json

  def index
    # Get current user's invitations
    uid = current_user.uid
    @invitations = Invitation.find_all_by_uid(uid)

    # Get current user's playlists
    @playlist = current_user.playlists
  end

  def create
  	 playlist = current_user.playlists.create(:name => params[:name])
     uid = current_user.uid
     Playlist.notify_observers(:custom_after_create, playlist, uid)
  	 respond_with(playlist)
  end

  def show
  	@playlist = Playlist.find_by_id(params[:id])
  end

  def update
  	playlist = Playlist.find_by_id(params[:id])
    playlist.update_attributes(:name => params[:name])
    Playlist.notify_observers(:custom_after_update, playlist, current_user.uid)
    respond_with(playlist)
  end

  def destroy
    playlist = Playlist.find_by_id(params[:id])
    current_user.playlists.delete(playlist)
    Playlist.notify_observers(:custom_after_destroy, playlist, current_user.uid)
    respond_with("success")
  end
 
end
