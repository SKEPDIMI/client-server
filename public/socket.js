var socket;

function socket_script () {
  socket = io();

  socket.on('users_data', function(users) {
    console.log(users)
  });
  socket.on('user_move', function(user_id, direction){
    userMove(user_id, direction)
  });
  socket.on('user_stop', function(user_id) {
    userStop(user_id)
  });
  socket.on('user_connect', function(user_id) {
    addPlayer(user_id)
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
        socket.emit('move_up')
        break
      case 65:
      socket.emit('move_left')
        break
      case 83:
      socket.emit('move_down')
        break
      case 68:
      socket.emit('move_right')
        break
    }
  });

  $(document).on('keyup', function() {
    socket.emit('move_stop');
    allowed = true
  });
}