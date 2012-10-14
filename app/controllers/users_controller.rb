class UsersController < ApplicationController
	respond_to :json
	def new
		@user = User.new
	end

	def create
		@user = User.new(params[:user])
		if @user.save
			redirect_to root_url, :notice => "Signed up!"
		else
			render "new"
		end
	end

	def show
		@user = User.find(params[:id])
		@playlists = @user.playlists
		@followers = Relationship.where(:followed_id => @user.id)
		@following = Relationship.where(:follower_id => @user.id)
		@plays = @user.plays
		# @play_songs = []
		# @plays.each do |play|
		# 	@play_songs << play.song
		# end
		#do users the exact same way
	end

	def following
		@user = User.find(params[:id])
		@following = Relationship.where(:follower_id => @user.id)
	end

	def followers
		@user = User.find(params[:id])
		@followers = Relationship.where(:followed_id => @user.id)
	end

end
