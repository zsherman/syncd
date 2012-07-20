class User < ActiveRecord::Base
  attr_accessible :email, :password_hash, :password_salt
  has_many :playlists
end
