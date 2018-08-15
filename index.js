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
  io.emit('user_connect', socket.id)
  socket.on('move_left', function() {
    socket.emit('user_move', socket.id, 'left');
  });
  socket.on('move_right', function() {
    console.log("USR MV RGHT")
    socket.emit('user_move', socket.id, 'right');
  });
  socket.on('move_up', function() {
    socket.emit('user_move', socket.id, 'up');
  });
  socket.on('move_down', function() {
    socket.emit('user_move', socket.id, 'down');
  });
  socket.on('move_stop', function() {
    socket.emit('user_stop', socket.id);
  });

  socket.on('disconnect', function(){
    io.emit('user_disconnect', socket.id);
    delete users[socket.id];
  });
});

server.listen(3000, () => console.log('Listening...'))