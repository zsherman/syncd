class Invitation < ActiveRecord::Base
	belongs_to :playlist
	attr_accessible :playlist_id, :uid, :inviter_uid

	def playlist_name
		Playlist.find_by_id(playlist_id).name
	end

	def inviter_name
		User.find_by_uid(inviter_uid).email
	end

end
