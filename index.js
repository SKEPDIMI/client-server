var express = require('express');
var app = express();
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/bower_components'));  
app.get('/', function(req, res,next) {  
  res.sendFile(__dirname + '/index.html');
});

users = {};

loop = setInterval(function() {
  io.emit('users', users);
}, 15) // 66 Hz

io.on('connect', (socket) => {
  console.log('socket connected! ' + socket.id);
  users[socket.id] = {
    x: 0, y: 0
  };
  console.log(users)

  socket.on('left', function() {
    users[socket.id].x -= 1
  });
  socket.on('right', function() {
    users[socket.id].x += 1
  });
  socket.on('up', function() {
    users[socket.id].y -= 1
  });
  socket.on('down', function() {
    users[socket.id].y += 1
  });

  socket.on('disconnect', function(socket){
    delete users[socket.id]
  });
});

server.listen(3000, () => console.log('Listening...'))