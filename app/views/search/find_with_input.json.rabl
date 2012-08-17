collection @songs, :object_root => false, :root => false
attributes :title, :artist, :url, :image
child :image do
  attributes :small
end