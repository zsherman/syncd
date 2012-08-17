var faye = new Faye.Client('http://thawing-peak-7366.herokuapp.com/faye');
faye.subscribe("/messages/new", function(data) {alert(data)});
