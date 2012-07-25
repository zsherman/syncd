collection @playlist, :root => false, :object_root => false
attributes :id, :created_at, :updated_id, :name, :default
node (:count) { |playlist| playlist.songs.count }
node (:songs) { }