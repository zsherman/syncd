class Song < ActiveRecord::Base
  attr_accessible :artist, :title, :url
  has_and_belongs_to_many :playlists
end
