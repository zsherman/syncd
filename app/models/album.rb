class Album < ActiveRecord::Base
  attr_accessible :artwork, :name, :release_date, :list_type
  belongs_to :artist
  has_and_belongs_to_many :songs
end
