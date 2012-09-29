class Album < ActiveRecord::Base
	include Tire::Model::Search
    include Tire::Model::Callbacks
	attr_accessible :artwork, :name, :release_date, :list_type
	has_and_belongs_to_many :artists
	has_and_belongs_to_many :songs

	mapping do
        indexes :id,           :index    => :not_analyzed
        indexes :name,         :analyzer => 'snowball', :boost => 100
        indexes :artist,       :as       => 'artist'
        indexes :release_date, :index    => :not_analyzed
     end

	def artist 
		begin 
			self.artists.first.name 
		rescue
			"Unknown"
		end
	end
end
