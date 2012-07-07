class Song < ActiveRecord::Base
  attr_accessible :artist, :title, :url
end
