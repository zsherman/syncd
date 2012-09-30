class Play < ActiveRecord::Base
  attr_accessible :user_id, :song_id
  belongs_to :user
  belongs_to :song
end
