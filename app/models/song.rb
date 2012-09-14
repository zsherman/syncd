class Song < ActiveRecord::Base
	attr_accessible :title, :audio, :url, :id, :image
	has_and_belongs_to_many :playlists
	has_and_belongs_to_many :artists
	has_and_belongs_to_many :albums

	def faye_channel(args)
		playlist_id = args[0].to_s 
		::Rails.logger.info('songs'+playlist_id)
		return 'songs'+playlist_id

	end

	def album 
	begin 
		self.albums.first.name 
	rescue
		"Unknown"
	end
	end

	def artist
		begin 
		self.artists.first.name 
	rescue
		"Unknown"
	end
	end

  	def as_json(options={})
		{ :id => id, :title => title, :audio => audio,
		  :url => url, :image => image,
		  :artist => artist
		}
	end

end
