module Exfm
  include HTTParty
  require 'uri'
  base_uri 'http://ex.fm/api/v3/song/search'
  API_KEY = ''

  def self.search(input)
    Rails.logger.info base_uri+'/'+URI.escape(input)
    response = HTTParty.get(base_uri+'/'+URI.escape(input)+"?results=50")
    results = JSON.parse(response.body)
    tracks = results["songs"]
    @exfm_songs = []
    tracks.each do |t|
      @exfm_songs << Song.find_or_create_by_title_and_artist_and_audio_and_image(:title => t["title"], :artist => t["artist"], :audio => t["url"], :image => t["image"]["large"])
    end
    Rails.logger.debug @exfm_songs
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