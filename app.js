/*eslint-env node*/

//------------------------------------------------------------------------------
// Chatly - A Socket.io Application
//------------------------------------------------------------------------------

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var app = express();

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// setup port or prod and dev
var port = 8080;

// create the server so that we can run for socket.io
var http = require('http').Server(app);

// create socket.io server
var io = require('socket.io')(http);

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// start server on the specified port and binding host
http.listen(port, '0.0.0.0', function() {
	// message when the sever starts listening
	console.log("server stating on " + appEnv.url);
	console.log("port number is: " + port);
});

// Create USER array to keep track of socket usernames
var users = [];
	// remove method for easier execution
users.remove = function (user) {
    var index = this.indexOf(user);
    this.splice(index, 1);
};

// create the main page route
app.get('/', function(req, res) {
	res.sendFile(__dirname + 'public/index.html');
});

// action when user creates a socket
io.on('connection', function (socket) {
	console.log('Socket: ' + socket.id + ' has connected');

	socket.on('new user', function (data, callback) {
		/*
		console.log("user array==");
		for (var i = 0, len = users.length; i < len; i++) {
			console.log("user[" + i + "]: " + users[0]);
		} console.log("====");
		*/

		console.log("attempting new username: " + data);
		console.log('users.indexOf(data) = ' + users.indexOf(data));

		if(users.indexOf(data) !== -1) { // Checks if username is already being used
			console.log("username taken: " + data);
			callback(false);
		} else if(data.indexOf(' ') !== -1) { // Ensures there are no spaces in the username
			callback(false);
		} else if(data.length > 15) { // Ensures that the username is MAX 15 characters
			callback(false);
		} else if (users.indexOf(data) === -1){ // Proceed if username is VALID
			console.log("username accepted: " + data);
			callback(true);
			socket.username = data;
			users.push(socket.username);
			//io.emit('usernames', users);
			console.log('Socket ' + socket.id + ', has chosen username: ' + socket.username);
		} else {
			console.log('unknown username fail');
			callback(false);
		}
	});

	socket.on('disconnect', function () {
		console.log('User: ' + socket.username + ' has disconnected on socket ' + socket.id);
		users.remove(socket.username);
	});

	socket.on('send message', function(data) {
		socket.broadcast.emit('new message', data);
	});
});
