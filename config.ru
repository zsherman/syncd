# This file is used by Rack-based servers to start the application.

require ::File.expand_path('../config/environment',  __FILE__)
run Syncd::Application

# faye_server = Faye::RackAdapter.new(:mount => '/faye', :timeout => 45)
# run faye_server