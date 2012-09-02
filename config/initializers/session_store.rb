# Be sure to restart your server when you modify this file.

Syncd::Application.config.session_store :cookie_store, { 
	:key => '_syncd_session',
	:expire_after => 60*24*60*60
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rails generate session_migration")
# Syncd::Application.config.session_store :active_record_store
