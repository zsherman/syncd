class Playlist < ActiveRecord::Base
  attr_accessible :name, :url
  has_and_belongs_to_many :songs
  has_and_belongs_to_many :users

  def faye_channel(*args)
  	return 'playlists'
  end
end
