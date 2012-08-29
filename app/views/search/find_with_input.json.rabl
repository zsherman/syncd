collection @songs, :object_root => false, :root => false
attributes :title, :artist, :audio, :image, :id
child :image do
  attributes :large
end