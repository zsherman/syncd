class AuthenticationsController < ApplicationController
    def create
        auth = request.env['omniauth.auth']
        logger.debug "Auth variable: #{auth.inspect}"

        # Try to find authentication first
        authentication = Authentication.find_by_provider_and_uid(auth['provider'], auth['uid'])

        if authentication && current_user && session["fb_expiry"] < Time.now.to_i
            # Authentication found, current user is signed in, and token has expired.
            # Refresh the token with the new one and update the session info
            authentication.update_attribute("token", auth['credentials']['token'])
            refresh_session(auth)

        elsif authentication && !current_user
            # Authentication found and user not signed in
            # Sign the user in
            sign_in(:user, authentication.user)

        elsif !authentication 
            # Authentication not found, so create a new user.
            user = User.new
            user.apply_omniauth(auth)

            # Add token info to session
            refresh_session(auth)

            user.save(:validate => false) ? sign_in(:user, user) : redirect_to root_url
            # if user.save(:validate => false)
            #     sign_in(:user, user)
            # else
            #     redirect_to root_url
            # end
        end
        render :text => "<pre>"+signed_in?(:user).to_s+"</pre>"
    end

    def signout
        sign_out :user
        render :text => "signed out"
    end

    def refresh_session(auth)
        session.merge!({
            "fb_access_token" => auth['credentials']['token'],
            "fb_expiry" => auth['credentials']['expires_at']
        })
    end

end