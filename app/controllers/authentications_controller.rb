class AuthenticationsController < ApplicationController
    def create
        auth = request.env['omniauth.auth']
        logger.debug "Auth variable: #{auth.inspect}"

        # Try to find authentication first
        authentication = Authentication.find_by_provider_and_uid(auth['provider'], auth['uid'])
        
        unless current_user 
            # Request a new 60 day token using the current 2 hour token obtained from fb
            auth.merge!(extend_fb_token(auth['credentials']['token']))
            authentication.update_attribute("token", auth['extension']['token']) if authentication

            unless authentication
                user = User.new
                user.apply_omniauth(auth)
                saved_status = user.save(:validate => false)
            end

            # Add the new token and expiration date to the user's session
            create_or_refresh_fb_session(auth)
            if saved_status.nil? || saved_status
                user = authentication ? authentication.user : user
                sign_in(:user, user)
            end
        end

        render :json => { :success => (current_user ? true : false), :current_user => current_user.as_json(:only => [:email]) }
    end

    def signout
        success = delete_fb_session && sign_out(:user)
        render :json => { :success => success.as_json }
    end

    def create_or_refresh_fb_session(auth_hash_or_extension_hash)
        if auth_hash_or_extension_hash['extension']
            session.merge!({
                "fb_access_token" => auth_hash_or_extension_hash['extension']['token'],
                "fb_expiry" => auth_hash_or_extension_hash['extension']['expiry'].to_i + Time.now.to_i
            })
        elsif auth_hash_or_extension_hash['credentials']
            session.merge!({
                "fb_access_token" => auth_hash_or_extension_hash['credentials']['token'],
                "fb_expiry" => auth_hash_or_extension_hash['credentials']['expires_at']
            })
        end
    end

    def extend_fb_token(token)
        # can be called once a day to extend fb access token
        # if called twice or more in one day, will return the same token

        require "net/https"
        require "uri"

        uri = URI.parse("https://graph.facebook.com/oauth/access_token?client_id=504807159545247&client_secret=7dc2316ec56958a904e2c69735813795&grant_type=fb_exchange_token&fb_exchange_token="+token)
        http = Net::HTTP.new(uri.host, uri.port)
        http.use_ssl = true
        http.verify_mode = OpenSSL::SSL::VERIFY_NONE

        request = Net::HTTP::Get.new(uri.request_uri)

        response = http.request(request)
        matched_response = /access_token=(.+)&expires=(.+)/.match(response.body)
        parsed_response = Hash["extension", Hash["token", matched_response[1], "expiry", matched_response[2]]]
        return parsed_response

    end

    def delete_fb_session
        session.delete("fb_expiry")
        session.delete("fb_access_token")
    end

end