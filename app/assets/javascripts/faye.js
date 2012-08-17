var faye = new Faye.Client('http://glacial-oasis-6992.herokuapp.com/faye');
faye.disable('websocket');
faye.subscribe("/messages/new", function(data) {alert(data)});
