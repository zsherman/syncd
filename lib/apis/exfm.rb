module Exfm
  require 'uri'
  require 'typhoeus'
  require 'rbrainz'
  include MusicBrainz
  include HTTParty
  base_uri 'http://ex.fm/api/v3/song/search'
  API_KEY = ''

  def self.search(input, results)
    #Rails.logger.info base_uri+'/'+URI.escape(input)
    #response = HTTParty.get(base_uri+'/'+URI.escape(input)+"?results=" + results.to_s)
    #results = JSON.parse(response.body)
    #tracks = results["songs"]
    @exfm_songs = []

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

    # Grab the unique musicbrainz uuid for the artist and 
    artist_query = query.get_artists(:name => input)
      
    if artist_query.count != 0
      uuid = artist_query.first.entity.id.uuid 
    else
      return
    end

    if Artist.find_by_mbid(uuid).nil?

      # Create a hydra, we will use it later
      hydra = Typhoeus::Hydra.new
      requests = []

      mbid = Model::MBID.new(uuid, :artist)
      artist = query.get_artist_by_id(mbid, artist_includes)

      # Iterate through the releases and insert the albums and songs into our database
      artist.releases.each_with_index do |r, i|

        if r.release_events.first.country == "US"

          # Grab the release iD
          release_id = r.id.uuid

          # Grab more info about the release (i.e. tracks, featured artists, etc)
          release = query.get_release_by_id(release_id, :artist=>true, :tracks=>true, :release_events=>true)
          
          # Create the artist and the albums. Associate them all
          # Should handle multiple artist on a single album, i.e. "feat", etc
          #type = r.tags.first.to_s.match('#(.*)')[0]
          artist = Artist.find_or_create_by_name_and_mbid(artist.name, uuid)
          album = Album.create(:name => release.title)

          artist.albums << album

          # Create the empty tracks (no audio files associated with them)
          songs = []
          release.tracks.each do |t|
            songs << Song.create(:title => t.to_s)
          end

          # Associate the songs with the artist and the album
          artist.songs << songs
          album.songs << songs

          # Qeuee a request to exfm
          requests[i] = Typhoeus::Request.new(base_uri+'/'+URI.escape(release.title)+"?results=100")
          #requests[i] = Typhoeus::Request.new("http://localhost:3000/playlists.json")
          
          requests[i].on_complete do |response|
            results = JSON.parse(response.body)
            tracks = results["songs"]

            tracks.each do |t|
              begin 
                Song.find_by_title(t["title"]).update_attributes("audio" => t["url"], "image" => t["image"]["large"])
              rescue
              end
            end

            #Rails.logger.info base_uri+'/'+URI.escape(input)
            #Rails.logger.debug a
          end

          hydra.queue requests[i]

        end

      end #do block

      # Activate queueed batch requests for exfm
      hydra.run

    end #if statement
    #Rails.logger.debug @exfm_songs
    return @exfm_songs
  end

end


# class Twitter
#   include HTTParty
#   base_uri 'twitter.com'

#   def initialize(u, p)
#     @auth = {:username => u, :password => p}
#   end

#   # which can be :friends, :user or :public
#   # options[:query] can be things like since, since_id, count, etc.
#   def timeline(which=:friends, options={})
#     options.merge!({:basic_auth => @auth})
#     self.class.get("/statuses/#{which}_timeline.json", options)
#   end

#   def post(text)
#     options = { :query => {:status => text}, :basic_auth => @auth }
#     self.class.post('/statuses/update.json', options)
#   end
# end

# twitter = Twitter.new(config['email'], config['password'])
# pp twitter.timeline