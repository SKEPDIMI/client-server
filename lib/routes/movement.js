const helpers = require('../helpers');

module.exports = io => {
  var nsp = io.of('/movement');
  var users_data = {};
  
  nsp.on('connect', (socket) => {
    socket.on('join_game', function() {
      if (Object.keys(users_data).length == 0) { // If there are no users in our list, begin the loop with this one!
        users_data[socket.id] = helpers.generateUserData();
        beginLoop();
      } else { // Or just add to the users list
        users_data[socket.id] = helpers.generateUserData();
      }
    });
    socket.on('user_position', function(coord) {
      let {x, y} = coord;
  
      users_data[socket.id].x = x
      users_data[socket.id].y = y
    });
    socket.on('move', function(direction) {
      direction = directions.includes(direction) ? direction : false;
      users_data[socket.id].moving = direction;
    });
    socket.on('move_stop', function(coordinates) {
      let {x, y} = coordinates;
  
      users_data[socket.id] = {
        moving: false,
        x,
        y
      };
    });
  
    socket.on('disconnect', function(){
      socket.emit('user_disconnect', socket.id);
      delete users_data[socket.id];
    });
  });

  directions = ['left', 'right', 'up', 'down'];

  var loop = false;
  function beginLoop() {
    loop = setInterval(() => {
      if (Object.keys(users_data).length == 0) { // If there are no users, stop the looping!
        clearInterval(loop);
        loop = false;
        console.log("stopped server loop");
      } else { // Else if there are users, send that!
        for (id in users_data) {
          u = users_data[id]
          if (!u.test) {
            continue
          }
          users_data[id].moving = directions[Math.floor(Math.random()*directions.length)]
        }
        nsp.emit('users_data', users_data);
        // console.log('$')
      }
    }, 15);
  }
}