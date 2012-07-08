class PlaylistsController < ApplicationController
  respond_to :json

  def index
  	@playlist = Playlist.all
  end

  def create
  	 playlist = Playlist.create(:name => params[:name])
  	 respond_with(playlist)
  end

  def show
  	@playlist = Playlist.find_by_id(params[:id])
  end

  def update
  	playlist = Playlist.find_by_id(params[:id])
    playlist.update_attributes(:name => params[:name])
    respond_with(playlist)
  end

end
