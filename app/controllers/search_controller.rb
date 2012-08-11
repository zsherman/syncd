class SearchController < ApplicationController
	before_filter :authenticate_user!
	respond_to :json
	require 'apis/exfm'

	def find_song_with_artist
		@songs = Song.where(:title => params[:song]).where(:artist => params[:artist])
		response = HTTParty.get('http://ex.fm/api/v3/song/search/'+(params[:artist]+" "+params[:title]))
		results = JSON.parse(response.body)
		tracks = results["songs"]
		tracks.each do |t|
			@songs << Song.find_or_create_by_title_and_artist_and_url(:title => t["title"], :artist => t["artist"], :url =>t["url"])
			logger.info "song created"
		end
		logger.info results
		#search for song in our db
		#use api to find song with httparty
		#return song object/objects (depending on bookmarklet/app) with json
		#store searched song in our db
		#respond_to block
		respond_to do |format|
    		format.html
    		format.json
  		end
	end

	def find_with_artist

	end

	def find_with_song
		#do stuff
	end
end
