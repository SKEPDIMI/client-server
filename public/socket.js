var socket;

function socket_script () {
  socket = io();

  socket.on('users_data', function(users_data) {
    for (user_id in users_data) {
      if (users_list.hasOwnProperty(user_id)) {
        user = users_data[user_id]
        
        if (!user.moving) {
          users_list[user_id].x = user.x
          users_list[user_id].y = user.y
        }
      } else {
        addPlayer(user_id, users_data[user_id])
      }
    }
  })
  socket.on('user_move', function(user_id, direction){
    userMove(user_id, direction)
  });
  socket.on('user_stop', function(user_id) {
    userStop(user_id)
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
    socket.emit('move_stop');
    allowed = true
  });
}