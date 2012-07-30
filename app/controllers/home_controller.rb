class HomeController < ApplicationController
  def index
  	if false
  		redirect_to playlists_url
  	else
		# client = OAuth2::Client.new(
		#   '504807159545247', 
		#   '7dc2316ec56958a904e2c69735813795',
		#   :authorize_url => "/dialog/oauth",
		#   :token_url => "/oauth/access_token",
		#   :site => "https://www.facebook.com/"
		# )
		# token = client.auth_code

  #       logger.debug "Auth variable: #{token.inspect}"
  	end
  end
end
