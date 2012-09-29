class SearchController < ApplicationController
	before_filter :authenticate_user!
	respond_to :json
	require 'apis/exfm'
	require 'apis/bandcamp'
	require 'apis/console'
	require 'ostruct'


	def find_with_input
		#for general search box, may contain song or artist or both
		#returns relevant songs
		input = params[:input]

		begin 
			Exfm.search(input, 50)
		rescue
			# Do something here.
		end

		#@songs = Song.joins{artists}.where{(artists.name.like '%'+input+'%') | (title.like '%'+input+'%')}
		@artist = Artist.where{(name.like input)}.first

	end

	def find_everything
		input = params[:input]

		@artists = Artist.search input
		@albums = Album.search input
		@songs = Song.search input

		render :json => { 'artists' => @artists.as_json, 'albums' => @albums.as_json, 'songs' => @songs.as_json }

	end

end
