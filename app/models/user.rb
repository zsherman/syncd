class User < ActiveRecord::Base
	# Include default devise modules. Others available are:
	# :token_authenticatable, :confirmable,
	# :lockable, :timeoutable and :omniauthable
	devise :database_authenticatable, :registerable,
	     :recoverable, :rememberable, :trackable, :validatable,
	     :omniauthable

	# Setup accessible (or protected) attributes for your model
	attr_accessible :email, :password, :password_confirmation, :remember_me, :first_name, :last_name
	has_and_belongs_to_many :playlists
	has_many :authentications

	def apply_omniauth(auth)
		# In previous omniauth, 'user_info' was used in place of 'raw_info'
		self.email = auth['extra']['raw_info']['email']
		self.first_name = auth['info']['first_name']
		self.last_name = auth['info']['last_name']
		# Again, saving token is optional. If you haven't created the column in authentications table, this will fail
		authentications.build(:provider => auth['provider'], :uid => auth['uid'], :token => auth['extension']['token'])
	end

	def uid
		self.authentications.first.uid
	end

	def self.find_by_uid(uid)
		auth = Authentication.find_by_uid(uid.to_s)
		auth.user if Authentication.find_by_uid(uid.to_s)
	end

end
