class SearchController < ApplicationController
	before_filter :authenticate_user!
	respond_to :json
	require 'apis/exfm'
	require 'apis/bandcamp'
	require 'apis/console'


	def find_song_with_artist
		#for bookmarklet mostly
		#search for song in our db
		#use api to find song with httparty
		#return song object/objects (depending on bookmarklet/app) with json
		#store searched song in our db
		#respond_to block
		input = params[:song] + " " + params[:artist]
		@songs = Song.includes([:artists]).where('artists.name' => params[:artist], :title => params[:song])
		@exfm_songs = Exfm.search(input, 10)
		@exfm_songs.each do |ex|
			@songs << ex
		end
		logger.debug @songs.inspect

		respond_to do |format|
    		format.html
    		format.json
  		end
	end

	def find_with_artist
		#returns songs by that artist
		input = params[:artist]
		@songs = Song.where(:artist => params[:artist])
		@exfm_songs = Exfm.search(input)
		@exfm_songs.each do |ex|
			@songs << ex
		end
		logger.debug @songs.inspect
		
		respond_to do |format|
    		format.html
    		format.json
  		end
	end

	def find_with_song
		#for song search selection
		#returns relevant songs
		input = params[:song]
		@songs = Song.where(:title => params[:song])
		@exfm_songs = Exfm.search(input)
		@exfm_songs.each do |ex|
			@songs << ex
		end
		logger.debug @songs.inspect
		
		respond_to do |format|
    		format.html
    		format.json
  		end
	end

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
end
