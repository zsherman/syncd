require 'rubygems'
require 'typhoeus'
require 'json'
require 'rbrainz'
include MusicBrainz

  # release_includes = Webservice::ReleaseIncludes.new(
  #  :track_rels        => true,
  #  :track_level_rels  => true,
  #  :artist            => true,
  #  :tracks            => true,
  #  :labels            => true,
  #  :counts            => true
  # )
  # 
  # mbid = Model::MBID.new('d5cc67b8-1cc4-453b-96e8-44487acdebea', :artist)
  # 
  # q = MusicBrainz::Webservice::Query.new
  # releases = q.get_releases(Webservice::ReleaseFilter.new(:artist=>'d5cc67b8-1cc4-453b-96e8-44487acdebea'))
  # 
  # releases.each do |r|
  #   puts r.score
  # end
  
  # releases[0].tracks do |t|
  #   puts t.title
  # end

# With the ArtistInclude object we can control what kind of information
# the MusicBrainz server will incrlude in its answer.
artist_includes = Webservice::ArtistIncludes.new(
 :aliases      => true,
 :releases     => ['Album', 'Official'],
 :artist_rels  => true,
 :release_rels => true,
 :track_rels   => true,
 :label_rels   => true,
 :url_rels     => true,
 :counts => true,
 :release_events => true
)

# Query the webservice for the artist with the above ID. The result
# will contain all the information specified in artist_includes.
query = Webservice::Query.new
artist_query = query.get_artists(:name => "Purity Ring")

if artist_query.count != 0
  uuid = artist_query.first.entity.id.uuid 
end

# Create an MBID object which represents a MusicBrainz artist ID.
mbid = Model::MBID.new(uuid, :artist)

artist = query.get_artist_by_id(mbid, artist_includes) # hydra.queue in get_entity_by_id
# @webservice.get will return a typhoeus::Request (Typhoeus::Request.new())

#puts artist.releases[3].instance_variables
artist.releases.each do |r|
  if r.release_events.first.country == "US"
    release_id = r.id.uuid
    release = query.get_release_by_id(release_id, :artist=>true, :tracks=>true, :release_events=>true)
    puts ""
    puts r.id
    puts "Album Name: " + release.title
    puts "Artist: "+release.artist.name
    puts r.tags.first.methods
    puts r.types
    release.tracks.each do |t|
      puts t.to_s
    end
    # r.release_events.each do |e|
    #   puts e.country
    # end
  end
  
  # hydra = Typhoeus::Hydra.new
  # 
  # first_request = Typhoeus::Request.new("http://localhost:3000/posts/1.json")
  
  
  
  
  
  # puts ""
  # puts ""
  # entity
  # uuid
  # to_mbid
  # to_s
  
  
  #puts r.id.uuid
  # puts r.title
  # puts r.tracks
  # puts r.release_events
  # puts r.discs
  # puts r.artist
  # puts r.asin
  # puts r.tags
  # puts r.types
end
