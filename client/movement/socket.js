var Client = {};

Client.socket = io('/movement');

Client.joinGame = function() {
  Client.socket.emit('join_game');
}

Client.socket.on('users_data', function(users_data) {
  // for all users in the server users data, if it exists update them, if not, add them
  for (id in users_data) {
    user = users_data[id]
    if (users_list.hasOwnProperty(id)) {
      updatePlayer(id, user)
    } else {
      addPlayer(id, user)
    }
  }

  for (id in users_list) { // Will get rid of users in the game if they are not in the server users_data object
    if (!users_data.hasOwnProperty(id)) {
      removePlayer(id)
    }
  }
});

Client.socket.on('user_disconnect', function(user_id) {
  removePlayer(user_id)
});

allowed = true;

$(document).on('keydown', function(event) {
  if (event.repeat != undefined) {
    allowed = !event.repeat;
  }
  if (!allowed) return;
  allowed = false;

  switch(event.which){
    case 87:
      Client.socket.emit('move', 'up')
      break
    case 65:
      Client.socket.emit('move', 'left')
      break
    case 83:
      Client.socket.emit('move', 'down')
      break
    case 68:
      Client.socket.emit('move', 'right')
      break
  }
});

$(document).on('keyup', function() {
  let {x, y} = users_list[Client.socket.id];
  Client.socket.emit('move_stop', {x, y});
  allowed = true
});