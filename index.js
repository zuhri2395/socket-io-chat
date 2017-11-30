var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var connectedNick = {};

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(client) {
	client.on('join', function(name) {
		connectedNick[client.id] = name;
		io.emit('chatroom', name + ' joined the room');
	});
	
	client.on('send', function(msg) {
		var name = connectedNick[client.id];
		io.emit('chatroom', name + ': ' + msg);
	});
	
	client.on('disconnect', function() {
		io.emit('chatroom', connectedNick[client.id] + ' left the room');
		delete connectedNick[client.id];
	});
	// io.emit('chat message', 'a user connected');
	//
	// socket.on('chat message', function(msg){
	// 	io.emit('chat message', msg);
	// });
	//
	// socket.on('disconnect', function() {
	// 	io.emit('chat message', 'a user disconnected');
	// });
});

http.listen(3000, function() {
	console.log('listening on *:3000');
});