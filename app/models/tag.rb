class Tag < ActiveRecord::Base
  has_many :taggings, :dependent => :destroy
  has_many :playlists, :through => :taggings
end
