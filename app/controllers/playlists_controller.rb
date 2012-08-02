class PlaylistsController < ApplicationController
  before_filter :authenticate_user!
  respond_to :json

  def index
    @playlist = Playlist.all
  end

  def create
  	 playlist = Playlist.create(:name => params[:name])
  	 respond_with(playlist)
  end

  def show
    @id = params[:id]
  	@playlist = Playlist.find_by_id(params[:id])
  end

  def update
  	playlist = Playlist.find_by_id(params[:id])
    playlist.update_attributes(:name => params[:name])
    respond_with(playlist)
  end

  def destroy
    playlist = Playlist.find_by_id(params[:id])
    playlist.destroy
    respond_with("success")
  end

end
