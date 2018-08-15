var express = require('express');
var app = express();
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));  
app.get('/', function(req, res,next) {  
  res.sendFile(__dirname + '/public/index.html');
});

var users_data = {};

var loop = false;
function beginLoop() {
  loop = setInterval(() => {
    if (Object.keys(users_data).length == 0) { // If there are no users, stop the looping!
      clearInterval(loop);
      loop = false;
      console.log("stopped server loop");
    } else { // Else if there are users, send that!
      io.emit('users_data', users_data);
    }
  }, 15);
}

function generateUserData() {
  return { x: 0, y: 0, moving: false } // Probably will be more dynamic on the future
}

io.on('connect', (socket) => {
  if (Object.keys(users_data).length == 0) { // If there are no users in our list, begin the loop with this one!
    users_data[socket.id] = generateUserData();
    beginLoop();
  } else { // Or just add to the users list
    users_data[socket.id] = generateUserData();
  }

  socket.on('user_position', function(coord) {
    let {x, y} = coord;

    users_data[socket.id].x = x
    users_data[socket.id].y = y
  });
  socket.on('move', function(direction) {
    direction = ['left', 'right', 'up', 'down'].includes(direction) ? direction : false;
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

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Listening at PORT ' + PORT))
