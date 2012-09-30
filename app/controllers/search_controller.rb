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

		@artists = Artist.search input, :per_page => 4
		@albums = Album.search input, :per_page => 4
		@songs = Song.search input, :per_page => 25

		json = { 'artists' => { 'items'      => @artists.as_json,
								'pagination' => { 'total_entries' => @artists.total_entries,
												  'total_pages'   => @artists.total_pages,
												  'current_page'  => @artists.current_page													
											}
								},
				 'albums'  => { 'items'      => @albums.as_json,
								'pagination' => { 'total_entries' => @albums.total_entries,
												  'total_pages'   => @albums.total_pages,
												  'current_page'  => @albums.current_page													
											}
								},
				 'songs'  => { 'items'      => @songs.as_json,
								'pagination' => { 'total_entries' => @songs.total_entries,
												  'total_pages'   => @songs.total_pages,
												  'current_page'  => @songs.current_page													
											}
								}
			    }

		render :json => json

	end

end
