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
	has_many :plays, :dependent => :destroy
    has_many :songs, :through => :plays
    has_many :relationships, foreign_key: "follower_id", dependent: :destroy
    has_many :followed_users, through: :relationships, source: :followed
    has_many :reverse_relationships, foreign_key: "followed_id",
                                   class_name:  "Relationship",
                                   dependent:   :destroy
  	has_many :followers, through: :reverse_relationships, source: :follower

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

	def following?(other_user)
    	relationships.find_by_followed_id(other_user.id)
  	end

  	def follow!(other_user)
    	relationships.create!(followed_id: other_user.id)
  	end

  	def unfollow!(other_user)
    	relationships.find_by_followed_id(other_user.id).destroy
  	end

end
