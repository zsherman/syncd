object false 

node (:songs) { |m| @playlist.songs }

child @playlist.users => :subscribers do
  attributes :uid
end