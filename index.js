var express = require('express');
var cors = require('cors');
var app = express();
var server = require('http').createServer(app);  
var io = require('socket.io')(server, { reconnection: false });

require('./lib/routes/movement')(io);

app.use(cors());
app.use(express.static(__dirname + '/client'));  
app.get('/', function(req, res) { 
  res.sendFile(__dirname + '/client/index.html');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log('Listening at PORT ' + PORT))
