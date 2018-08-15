var socket;

// Speed up calls to hasOwnProperty
var hasOwnProperty = Object.prototype.hasOwnProperty;

function socket_script () {
  socket = io();

  socket.on('users_data', function(users_data) {
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

  socket.on('user_disconnect', function(user_id) {
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
        socket.emit('move', 'up')
        break
      case 65:
      socket.emit('move', 'left')
        break
      case 83:
      socket.emit('move', 'down')
        break
      case 68:
      socket.emit('move', 'right')
        break
    }
  });

  $(document).on('keyup', function() {
    let {x, y} = users_list[socket.id];
    socket.emit('move_stop', {x, y});
    allowed = true
  });
}