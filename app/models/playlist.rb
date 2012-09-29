class Playlist < ActiveRecord::Base
  attr_accessible :name, :url
  has_and_belongs_to_many :songs
  has_and_belongs_to_many :users
  has_many :invitations
  has_many :taggings, :dependent => :destroy
  has_many :tags, :through => :taggings

  def faye_channel(args)
  	uid = args[0].to_s
  	::Rails.logger.info(uid)
  	return uid+'/playlists'
  end
end
