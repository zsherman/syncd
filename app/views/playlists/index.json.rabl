collection @playlist, :root => false, :object_root => false

attributes :id, :created_at, :updated_id, :name

child :songs do
  attributes :id, :created_at, :updated_id, :title, :artist, :url
end