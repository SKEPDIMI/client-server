const uuid = require('uuid/v4')
const Dwarf = require('./entities/Dwarf')
const Bat = require('./entities/Bat')

module.exports = io => {
  var state = {
    turn: 0, // 0 means users, 1 means enemies
    enemies: {
      [uuid()]: new Bat()
    },
    activeSockets: {

    }
  }
  var nsp = io.of('/combat');

  // all new connections
  nsp.on('connection', (socket) => {
    // redux binding
    socket.on('JOIN_GAME', (name) => {
      socket.player = new Dwarf({
        id: socket.id,
        name: name || 'anonymous user'
      });
      state.activeSockets[socket.id] = socket;

      socket.emit('GAME_DATA', getGameData());
      socket.emit('SET_CURRENT_PLAYER', socket.player);
      socket.broadcast.emit('NEW_PLAYER', socket.player);
    });
    // disconnection
    socket.on('disconnect', () => {
      console.log('disconnected');
      delete state.activeSockets[socket.id];
    })
  });

  function getPlayers() {
    let sockets = state.activeSockets;
    let results = {}

    for(id in sockets) {
      results[id] = sockets[id].player
    }

    return results
  }
  function getGameData() {
    return {
      players: getPlayers(),
      level: {
        title: 'Foggy Woods',
      },
      enemies: state.enemies,
    };
  }
}
