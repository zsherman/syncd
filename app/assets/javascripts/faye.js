
var faye = new Faye.Client('http://glacial-oasis-6992.herokuapp.com/faye');
faye.setHeader('Access-Control-Allow-Origin', '*');
Faye.Transport.WebSocket.isUsable = function(_,c) { c(false) }
faye.subscribe("/messages/new", function(data) {alert(data)});

