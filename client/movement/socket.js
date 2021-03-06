var Client = {
  socket: io('/movement'),
  id: 0,
};

Client.joinGame = function() {
  Client.id = this.socket.id;

  Client.socket.emit('join_game');
}

var t1 = Date.now();
var serverDeltaTime = 0;

Client.socket.on('usersPool', function(usersPool) {
  serverDeltaTime = Date.now() - t1;
  t1 += serverDeltaTime;

  for (var id in usersPool) {
    var data = usersPool[id];
    if(spawnedUsers[id]) {
      var user = spawnedUsers[id];
      // do not interpolate the current user, just correct their position
      if (user.isCurrentUser) {
        spawnedUsers[id].movementQueue = data.movementQueue.splice(-1)
        continue
      }
      // INTERPOLATE
      let lastMovementData = user.movementQueue.splice(-1);

      if (lastMovementData) {
        // user.queue += lerp(last movement => received movement)
        spawnedUsers[id].movementQueue = buffer(lastMovementData, data.movementQueue);
      }
    } else {
      // add new user
      addPlayer(id, data);
    }
  }

  for (id in spawnedUsers) { // Will get rid of users in the game if they are not in the server users_data object
    if (!usersPool.hasOwnProperty(id)) {
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
      Client.socket.emit('move', 'up');
      currentUser.animateMovement(true, 'up');
      break
    case 65:
      Client.socket.emit('move', 'left');
      currentUser.animateMovement(true, 'left');
      break
    case 83:
      Client.socket.emit('move', 'down');
      currentUser.animateMovement(true, 'down');
      break
    case 68:
      Client.socket.emit('move', 'right');
      currentUser.animateMovement(true, 'right');
      break
  }
});

$(document).on('keyup', function() {
  Client.socket.emit('move_stop');
  currentUser.animateMovement(false, currentUser.direction);
  allowed = true
});