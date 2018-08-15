var express = require('express');
var app = express();
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));  
app.get('/', function(req, res,next) {  
  res.sendFile(__dirname + '/public/index.html');
});

users = {};

loop = setInterval(function() {
  io.emit('users_data', users);
}, 1000);

io.on('connect', (socket) => {
  users[socket.id] = {
    x: 100,
    y: 100,
    moving: false
  };

  socket.on('user_position', function(coord) {
    let {x, y} = coord;

    users[socket.id].x = x
    users[socket.id].y = y
  });
  socket.on('move', function(direction) {
    users[socket.id].moving = true;
    io.emit('user_move', socket.id, direction);
  });
  socket.on('move_stop', function() {
    users[socket.id].moving = false;
    io.emit('user_stop', socket.id);
  });

  socket.on('disconnect', function(){
    io.emit('user_disconnect', socket.id);
    delete users[socket.id];
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Listening at PORT ' + PORT))
