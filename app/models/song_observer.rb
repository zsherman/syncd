class SongObserver < ActiveRecord::Observer
	include BackboneSync::Rails::Faye::Observer

	def update(observed_method, object, *args)
		return unless respond_to?(observed_method)
		return if disabled_for?(object)
		send(observed_method, object, *args)
	end
end