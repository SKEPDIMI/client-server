var express = require('express');
var cors = require('cors');
var app = express();
var server = require('http').createServer(app);  
var io = require('socket.io')(server, { reconnection: false });

console.log('SERVER...STATUS = ', 'configuring environmental variables');

require('dotenv').config();

console.log('ENVIRONMENTAL VARIABLES:\nBCRYPT_SALT=' + process.env.BCRYPT_SALT + '\nREDIS_HOST=' + process.env.REDIS_HOST);

require('./lib/routes/authentication')(app);

require('./lib/routes/movement')(io);
require('./lib/routes/combat')(io);

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + '/client'));  
app.get('/', function(req, res) { 
  res.sendFile(__dirname + '/client/index.html');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log('SERVER...STATUS = ', 'Listening at PORT ' + PORT))
