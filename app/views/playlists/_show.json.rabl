collection @playlist, :root => false, :object_root => false

attributes :id, :created_at, :updated_id, :name

child :songs, :root => false do
  attributes :id, :created_at, :updated_id, :title, :artist, :url
end