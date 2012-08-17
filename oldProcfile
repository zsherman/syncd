web: bundle exec rails server thin -p $PORT -e $RACK_ENV
faye: bundle exec thin -p $PORT -e $RACK_ENV -R config.ru start