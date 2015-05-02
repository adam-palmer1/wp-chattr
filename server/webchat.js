// can also use passport + passport_local for authentication
var server = require('http').createServer();
var io = require('socket.io')(server);

var is_typing_list = [];
var msgStore = [];
var clientStore = [];

var messageStore = function(chatroom, name, data) {
	msg = {'name': name, 'data': data};
	msgStore[chatroom].push(msg);
};

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}


io.on('connection', function(client) {
	client.on('join', function(chatroom, nickname) {
		chatroom = typeof chatroom !== 'undefined' ? chatroom : "main";
		nickname = typeof nickname !== 'undefined' ? nickname : 'guest';

		//check if msgStore and clientStore are defined for this chatroom
		if (typeof msgStore[chatroom] === 'undefined')
		{
			msgStore[chatroom] = [];
		}
		if (typeof clientStore[chatroom] === 'undefined')
		{
			clientStore[chatroom] = [];
			is_typing_list[chatroom] = {};
		}

		var msg;
		var nickname = nickname.replace(/\W/g, ''); //alphanumeric only
		client.nickname = nickname
		client.chatroom = chatroom
		client.typing_timeout = false;
		console.log('Client connected: ' + nickname);
		client.join(chatroom);
		client.broadcast.to(chatroom).emit('messages', '<i>' + nickname + ' has joined!</i>');
		client.emit('messages', '<i>Welcome to ' + chatroom + '!</i>');
		client.broadcast.to(chatroom).emit('add_user', nickname);

		if (clientStore[chatroom].indexOf(nickname) == -1)
		{
			clientStore[chatroom].push(nickname);
		}

		clientStore[chatroom].forEach(function(client_name) {
			client.emit('add_user', client_name);
		});

		msgStore[chatroom].reverse().forEach(function(message) {
			client.emit('messages', message.name + ": " + message.data);
		});

	});
	client.on('messages', function(data) {
		var msg = client.nickname + ": " + htmlEntities(data);
		messageStore(client.chatroom, client.nickname, data);
		client.broadcast.to(client.chatroom).emit('messages', msg);
		client.emit('messages', msg);
	});
	client.on('is_typing', function() {
		if (client.typing_timeout !== false)
		{
			clearTimeout(client.typing_timeout);
		}
		var chatroom = client.chatroom
		var nickname = client.nickname

		is_typing_list[chatroom][nickname] = true;
		client.broadcast.to(chatroom).emit('is_typing', is_typing_list[chatroom]);
		client.emit('is_typing', is_typing_list[chatroom]);
		client.typing_timeout = setTimeout(function() {
			is_typing_list[chatroom][nickname] = false;
			client.broadcast.to(chatroom).emit('is_typing', is_typing_list[chatroom]);
			client.emit('is_typing', is_typing_list[chatroom]);
			client.typing_timeout = false;
		}, 2500);
	});

	client.on('end_typing', function() {
		var chatroom = client.chatroom
		var nickname = client.nickname
		is_typing_list[chatroom][nickname] = false;
		if (client.typing_timeout !== false)
		{
			clearTimeout(client.typing_timeout);
		}
		client.broadcast.to(chatroom).emit('is_typing', is_typing_list[chatroom]);
		client.emit('is_typing', is_typing_list[chatroom]);
	});

	client.on('disconnect', function(data) {
		var chatroom = client.chatroom
		var nickname = client.nickname
		client.broadcast.to(chatroom).emit('messages', '<i>' + nickname + ' has left!</i>');
		if (typeof nickname !== 'undefined' && typeof msgStore[chatroom] !== 'undefined')
		{
			var idx = msgStore[chatroom].indexOf(nickname);
			if (idx >= 0) {
				msgStore[chatroom].splice(idx, 1);
			}
		}
		client.broadcast.to(chatroom).emit('del_user', nickname);
	});

});

server.listen(8080);
