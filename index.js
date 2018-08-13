var express = require('express');
var app = express();
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/bower_components'));  
app.get('/', function(req, res,next) {  
  res.sendFile(__dirname + '/index.html');
});

users = [];

loop = setInterval(function() {
  io.emit('users', users);
}, 15) // 66 Hz

io.on('connect', (socket) => {
  console.log('socket connected! ' + socket.id);
  user = {id: socket.id, x: 0, y: 0}
  users.push(user)

  socket.on('left', function() {
    users.forEach(u => {
      if(u.id === socket.id){
        u.x -= 1
      }
    })
  });
  socket.on('right', function() {
    users.forEach(u => {
      if(u.id === socket.id){
        u.x += 1
      }
    })
  });
  socket.on('up', function() {
    users.forEach(u => {
      if(u.id === socket.id){
        u.y -= 1
      }
    })
  });
  socket.on('down', function() {
    users.forEach(u => {
      if(u.id === socket.id){
        u.y += 1
      }
    })
  });

  socket.on('disconnect', function(socket){
    console.log("User disconnected: " + socket.id)
    users = users.filter(u => u.id != socket.id)
  });
});

server.listen(3000)