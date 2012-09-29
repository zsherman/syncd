class TagsController < ApplicationController
	before_filter :authenticate_user!
  	respond_to :json


  	def update
  		@playlist = Playlist.find(params[:playlist_id])
  		@tag = Tag.find(params[:id])
  		playlist_tags << @tag
  	end

  	def create
      # start here
  		@playlist = Playlist.find(params[:playlist])
  		@tag = Tag.find_or_create_by_name(params[:name]) #check that params :name is the right attr to grab
      Tagging.create(:playlist_id => @playlist.id, :tag_id => @tag.id)
      #create association
  	end
end
