/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var fs = require('fs');
var app = express();
var websockServer = require('websocket').server;

// all environments
app.set('port', process.env.PORT || 48813);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

var web = http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

// websocks
var socket = new websockServer({
	httpServer: web,
	autoAcceptConnections: false
});

function originIsAllowed(origin) {
	console.log(origin);
	return 'lol';
}

connections = [];

socket.on('request', function(request) {
	if (!originIsAllowed(request.origin)) {
		request.reject();
		console.log('hello, i rejected' + request.origin);
		return;
	}

	var connection = (function() {
		try {
			return request.accept('wow', request.origin);
		} catch (error) {
			return;
		}
	}());

	if (!connection) return;
	console.log('i accept', request.origin);
	connections.push(connection);
	connection.on('close', function() {
		connections.forEach(function (cached, index) {
			if (cached == connection) {
				delete connections[index];
			}
		});
	});

	connection.on('message', function (message) {
		message = (function() {
			try {
				return JSON.parse(message.utf8Data);
			} catch (error) {
				return;
			}
		}());

		if (!message) return;
		connections.forEach(function(cached) {
			cached.send(JSON.stringify(message));
		});

		fs.readFile('data/icons.json', function (up, buffer) {
			if (up) throw up;
			try {
				var stickers = JSON.parse(buffer.toString());

				stickers.forEach(function (sticker, index) {
					if (sticker.id == message.id) {
						stickers[index] = message;
					}
				});

				fs.writeFile('data/icons.json', JSON.stringify(stickers), function (error) {
					if (error) console.error(error);
				});

			} catch (tantrum) {
				console.error(tantrum);
			}
		});
	});
});
