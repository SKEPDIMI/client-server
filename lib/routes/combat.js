const Dwarf = require('./entities/Dwarf')

module.exports = io => {
  var nsp = io.of('/combat');

  nsp.on('connection', (socket) => {
    socket.player = new Dwarf({
      id: socket.id,
    });

    socket.emit('data', {
      players: getAllPlayers(),
      level: {
        title: 'Foggy Woods',
      }
    });
    socket.broadcast.emit('newPlayer', socket.player);
  });

  function getAllPlayers() {
    var players = {};
    Object.keys(nsp.sockets).forEach(id => {
      players[id] = nsp.sockets[id].player;
    });
    return players;
  }
}
