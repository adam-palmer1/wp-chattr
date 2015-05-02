jQuery(document).ready(function($) {
	$(function() {
		var socket = io.connect(chattr_server + ":" + chattr_port);
                var sendChat = function() {
			var message = $('#msg').val();
			socket.emit('messages', message);
			$('#msg').val('');
			return false;
		}

		$('#msg').keypress(function(e) {
			socket.emit('is_typing');
			if (e.which == 13)
			{
				socket.emit('end_typing');
				sendChat();
			}
		});

		socket.on('connect', function(data) {
			$('#status').html('Connected');
			$('#message').animate({scrollTop: $('#message').get(0).scrollHeight}, 2000);
			socket.emit('join', chattr_chatname, nickname);
		});

		socket.on('disconnect', function(data) {
			$('#status').html('<p>Disconnected</p>');
		});

		socket.on('messages', function(data) {
			$('#message').append('<p class="individual">' + data + '</p>');
			$('#message').animate({scrollTop: $('#message').get(0).scrollHeight}, 400);
		});

		socket.on('is_typing', function(clients) {
	                var users_typing = [];
	                var connector = ' is ';
			for (c in clients)
			{
				if (clients[c] == true)
				{
               			        users_typing.push(c);
				}
			}
             		if (users_typing.length > 1) { 
           	        	connector = ' are '; 
          		}
         	        if (users_typing.length > 0) {
       	                	$('#typing').html('<p><i>' + users_typing.join(', ') + connector +  'typing...</i></p>');
        		} else {
    				$('#typing').html('<p><i>&nbsp;</i></p>');
        		}
		});

		socket.on('add_user', function(name) {
			var chatter = $('<li id="li-' + name + '">' + name + '</li>'); 
			$('#chatters-ul').append(chatter);
		});

		socket.on('del_user', function(name) {
			$('#li-' + name).remove();
		});
	});
});
