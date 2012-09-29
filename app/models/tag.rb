class Tag < ActiveRecord::Base
  # attr_accessible :title, :body
  has_many :taggings, :dependent => :destroy
  has_many :playlists, :through => :taggings
end
