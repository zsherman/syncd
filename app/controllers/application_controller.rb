class ApplicationController < ActionController::Base
  protect_from_forgery

  protected
	def verified_request?
	  !protect_against_forgery? || request.get? ||
	    form_authenticity_token == params[request_forgery_protection_token] ||
	    form_authenticity_token == request.headers['X-CSRF-Token'] ||
	    form_authenticity_token == request.env["rack.request.cookie_hash"]["csrf_token"]
	end
end
