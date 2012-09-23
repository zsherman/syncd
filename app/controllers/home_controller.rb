class HomeController < ApplicationController
	# need a before filter that checks to make sure access token is valid 
	# - is it sufficient enough to check the expiry date of 

  def index
  	redirect_to playlists_url if current_user
  end
end
