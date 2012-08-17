class Invitation < ActiveRecord::Base
	belongs_to :playlist
	attr_accessible :id, :playlist_id, :uid, :inviter_uid

	def playlist_name
		Playlist.find_by_id(playlist_id).name
	end

	def inviter_name
		User.find_by_uid(inviter_uid).email
	end

	def faye_channel(args)
  		uid = args[0].to_s
  		::Rails.logger.info(uid)
  		return uid+'/invitations'
  	end

  	def as_json(options={})
		{ :id => id, :playlist_id => playlist_id, 
		  :inviter_uid => inviter_uid, :playlist_name => playlist_name,
		  :inviter_name => inviter_name
		}
	end

end
