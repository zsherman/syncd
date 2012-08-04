class PlaylistObserver < ActiveRecord::Observer
	include BackboneSync::Rails::Faye::Observer
end