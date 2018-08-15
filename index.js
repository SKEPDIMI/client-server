var express = require('express');
var app = express();
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

testNum = null;

app.use(express.static(__dirname + '/public'));  
app.get('/:testNum', function(req, res,next) { 
  testNum = isNaN(Number(req.params.testNum)) ? 0 : Number(req.params.testNum);
  res.sendFile(__dirname + '/public/index.html');
});

var users_data = {};

// FOR STRESS TESTING 
function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}
function stressTest() {
  if (testNum > 0) {
    for (let i = 0; i < testNum; i++) {
      users_data[makeid()] = generateUserData('test')
    }
  }
}
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
      io.emit('users_data', users_data);
      // console.log('$')
    }
  }, 15);
}

function generateUserData(test = false) {
  return { x: 0, y: 0, moving: false, test } // Probably will be more dynamic on the future
}

io.on('connect', (socket) => {
  if (Object.keys(users_data).length == 0) { // If there are no users in our list, begin the loop with this one!
    users_data[socket.id] = generateUserData();
    beginLoop();
    stressTest();
  } else { // Or just add to the users list
    users_data[socket.id] = generateUserData();
  }

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

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Listening at PORT ' + PORT))
