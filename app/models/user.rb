class User < ActiveRecord::Base
	# Include default devise modules. Others available are:
	# :token_authenticatable, :confirmable,
	# :lockable, :timeoutable and :omniauthable
	devise :database_authenticatable, :registerable,
	     :recoverable, :rememberable, :trackable, :validatable,
	     :omniauthable

	# Setup accessible (or protected) attributes for your model
	attr_accessible :email, :password, :password_confirmation, :remember_me
	has_many :playlists
	belongs_to :authentication


	def apply_omniauth(auth)
	  self.email = auth['extra']['raw_info']['email']
	  authentications.build(:provider => auth['provider'], :uid => auth['uid'], :token => auth['credentials']['token'])
	end

end
