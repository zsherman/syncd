class Playlist < ActiveRecord::Base
  attr_accessible :name
  has_and_belongs_to_many :songs
  has_and_belongs_to_many :users

  def self.faye_channel
  	return 'playlists'
  end
end
