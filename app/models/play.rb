class Play < ActiveRecord::Base
  attr_accessible :user_id, :song_id, :created_at
  belongs_to :user
  belongs_to :song
end
