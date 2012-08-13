class Playlist < ActiveRecord::Base
  attr_accessible :name, :url
  has_and_belongs_to_many :songs
  has_and_belongs_to_many :users
  has_many :invitations

  def faye_channel(*args)
  	uid = args[0].join.to_s
  	::Rails.logger.info(uid)
  	return uid+'/playlists'
  end
end
