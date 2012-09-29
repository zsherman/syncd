class Artist < ActiveRecord::Base
	include Tire::Model::Search
    include Tire::Model::Callbacks
	attr_accessible :name
	has_and_belongs_to_many :songs
	has_and_belongs_to_many :albums

	mapping do
        indexes :id,           :index    => :not_analyzed
        indexes :name,         :analyzer => 'snowball', :boost => 100
        indexes :mbid,         :index    => :not_analyzed
     end
end
