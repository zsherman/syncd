collection @playlist, :root => false, :object_root => false
attributes :id, :created_at, :updated_id, :name, :editable
node (:count) { |playlist| playlist.songs.count }
node (:songs) { }