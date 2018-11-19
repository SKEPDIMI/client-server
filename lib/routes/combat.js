/**
 * REF:
 * 
 * var state = {
 *   turn: [0..1],
 *   enemies; {
 *     [id]: enemy
 *   },
 *   activeSockets: {
 *     [socket.id]: socket
 *   }
 * }
 * 
 * Player = {
 *   id: socket.id,
 *   entity: new Entity
 * }
 * 
 * function Entity() {
 *   const entityData = {
 *     id: Number,
 *     name: String,
 *   }
 *   const attacks = new Attacks,
 *   
 *   return {entityData, attacks}
 * }
 * 
 * function Attacks {
 *   return Array
 * }
 */

const uuid = require('uuid/v4')
const Dwarf = require('./entities/Dwarf')
const Bat = require('./entities/Bat')

module.exports = io => {
  var state = {
    turn: null, // 0 means users, 1 means enemies
    enemies: {
      
    },
    activeSockets: {

    }
  }

  // Generate enemies
  for (let i = 0; i < 4; i++) {
    let id = uuid();
    state.enemies[uuid()] = {
      id,
      entity: new Bat()
    }
  }

  var nsp = io.of('/combat');

  // all new connections
  nsp.on('connection', (socket) => {
    // redux binding
    socket.on('JOIN_GAME', (name) => {
      socket.player = {
        id: socket.id,
        entity: new Dwarf({
          name
        })
      };

      state.activeSockets[socket.id] = socket;
      socket.emit('GAME_DATA', getGameData());

      // if this user was not the first
      if (Object.keys(state.activeSockets).length > 1) {
        socket.broadcast.emit('NEW_PLAYER', socket.player);
      } else { // set the first turn
        state.turn = 0;
        socket.emit('TURN', 0);
      }
    });

    socket.on('CHOSEN', (action) => {

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
