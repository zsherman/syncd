class User < ActiveRecord::Base
	# Include default devise modules. Others available are:
	# :token_authenticatable, :confirmable,
	# :lockable, :timeoutable and :omniauthable
	devise :database_authenticatable, :registerable,
	     :recoverable, :rememberable, :trackable, :validatable,
	     :omniauthable

	# Setup accessible (or protected) attributes for your model
	attr_accessible :email, :password, :password_confirmation, :remember_me
	has_and_belongs_to_many :playlists
	has_many :authentications

	def apply_omniauth(auth)
		# In previous omniauth, 'user_info' was used in place of 'raw_info'
		self.email = auth['extra']['raw_info']['email']
		# Again, saving token is optional. If you haven't created the column in authentications table, this will fail
		authentications.build(:provider => auth['provider'], :uid => auth['uid'], :token => auth['extension']['token'])
	end

	def uid
		self.authentications.first.uid
	end

end
