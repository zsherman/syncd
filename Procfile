web: bundle exec rails server thin -p $PORT -e $RACK_ENV
worker: rackup faye/config.ru -s thin -E production