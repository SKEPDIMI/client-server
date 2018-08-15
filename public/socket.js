var socket;

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