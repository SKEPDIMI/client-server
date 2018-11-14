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
    socket.on('action', action => {
      switch(action.type){
        case 'server/JOIN_GAME':
          socket.player = new Dwarf({
            id: socket.id,
            name: action.payload || 'anonymous user'
          });
          state.activeSockets[socket.id] = socket;

          socket.emit('action', getGameData());
          socket.emit('action', { type: 'SET_CURRENT_PLAYER', payload: socket.player });
          socket.broadcast.emit('action', { type: 'NEW_PLAYER', payload: socket.player});
        default:
          console.log('received unknown action')
      }
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
    let payload = {
      players: getPlayers(),
      level: {
        title: 'Foggy Woods',
      },
      enemies: state.enemies,
    };

    return { type: 'GAME_DATA', payload: payload }
  }
}
