OmniAuth.config.logger = Rails.logger
#OmniAuth.config.option(:callback_path, "users/auth/facebook/callback")
#OmniAuth.config.full_host = "http://localhost:3000"

Rails.application.config.middleware.use OmniAuth::Builder do
  # The following is for facebook
  provider :facebook, '504807159545247', '7dc2316ec56958a904e2c69735813795'
  # If you want to also configure for additional login services, they would be configured here.
end
