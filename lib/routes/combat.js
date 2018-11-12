const uuid = require('uuid/v4')
const Dwarf = require('./entities/Dwarf')
const Bat = require('./entities/Bat')

module.exports = io => {
  var state = {
    turn: 0, // 0 means users, 1 means enemies
    enemies: {
      [uuid()]: new Bat()
    }
  }
  var nsp = io.of('/combat');

  nsp.on('connection', (socket) => {
    socket.player = new Dwarf({
      id: socket.id,
    });

    socket.emit('data', {
      players: getAllPlayers(),
      level: {
        title: 'Foggy Woods',
      },
      enemies: state.enemies,
    });
    socket.broadcast.emit('newPlayer', socket.player);

    socket.on('OK', (selection) => {
      let allOK = true; // if all players are ok
      if (allOK) {
        // calculate DMG
      }
      nsp.emit('results');
    });
  });

  function getAllPlayers() {
    var players = {};
    Object.keys(nsp.sockets).forEach(id => {
      players[id] = nsp.sockets[id].player;
    });
    return players;
  }
}
