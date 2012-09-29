class Tagging < ActiveRecord::Base
  attr_accessible :playlist_id, :tag_id
  belongs_to :playlist
  belongs_to :tag
end
