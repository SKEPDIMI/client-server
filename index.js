var express = require('express');
var app = express();
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

require('./lib/routes/movement')(io);

app.use(express.static(__dirname + '/client'));  
app.get('/', function(req, res,next) { 
  res.sendFile(__dirname + '/client/index.html');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Listening at PORT ' + PORT))
