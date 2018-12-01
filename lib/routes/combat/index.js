/**
 * REF:
 * 
 * var state = {
 *   turn: [0..1],
 *   enemies; {
 *     [id]: enemy
 *   },
 *   players: {
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
const ALL_ATTACKS = require('./data/attacks');
const Dwarf = require('./entities/Dwarf')
const Bat = require('./entities/Bat')

module.exports = io => {
  var state = {
    turn: null, // 0 means users, 1 means enemies
    enemies: {
      
    },
    players: {

    },
    // stored the events taken
    // on a turn in order to be sent
    events: [],
    // stored all the players that
    // take action during a certain turn
    takenAction: {}
  }

  // Generate enemies
  for (let i = 0; i < 4; i++) {
    let id = uuid();
    state.enemies[id] = {
      id,
      entity: Bat()
    }
  }

  var nsp = io.of('/combat');

  // all new connections
  nsp.on('connection', (socket) => {
    // redux binding
    socket.on('JOIN_GAME', (name) => {
      const player = {
        id: socket.id,
        entity: Dwarf({
          name
        })
      };

      const l = Object.keys(state.players).length

      if (l > 3) return console.log('GAME IS FULL');

      state.players[socket.id] = player;
      socket.emit('GAME_DATA', getGameData());

      // if this user was not the first
      if (l > 0) {
        socket.broadcast.emit('NEW_PLAYER', player);
      } else { // set the first turn
        state.turn = 0;
        socket.emit('TURN', 0);
      }
    });

    /**
     * event = {
     *   action: {
     *     type: String,
     *     id: Number,
     *   }
     *   // check target has id
     *   target: { id: 0 }
     * }
     */

    socket.on('ACTION', (event) => {
      // make sure that the socket has player data attached to it
      var player = getPlayerFromSocket(socket);
      if (!player) return console.log('ERROR', 'you are not in the match!');

      if (state.turn != 0) return socket.emit('ERROR', 'it is the enemy turn')
      // make sure that IF THE USER ALREADY CHOSE AN ACTION IN THIS TURN we do not continue
      if (state.takenAction[socket.id]) return socket.emit('ERROR', 'player already submitted an action!')

      /* TYPE CHECKING */

      if (typeof event != 'object') return

      const {
        action,
        target,
      } = event;

      if (typeof target != 'object') return socket.emit('ERROR', 'no event.target')
      if (!target.hasOwnProperty('id')) return socket.emit('ERROR', 'no target.id')
      if (typeof action != 'object') return socket.emit('ERROR', 'no event.action')
      if (typeof action.type != 'string') return socket.emit('ERROR', 'no action.type')
      if (!action.hasOwnProperty('id')) return socket.emit('ERROR', 'no action.id')

      /* END OF TYPE CHECKING */

      // 4) Now we want to find the target the player refered to. So we bundle up all characters
      //    in the state and point to the id given
      const receiver = {...state.enemies, ...state.players}[target.id];

      // 5) IF THE TARGET THE PLAYER REFERED TO DOES NOT EXIST IN THE GAME STATE
      //    we will not continue
      if (!receiver) return socket.emit('ERROR', 'target by id ' + target.id + ' was not found');
      if (receiver.id === socket.id) return socket.emit('ERROR', 'player cannot target self!');
      if (!receiver.entity.entityData.enemy) return socket.emit('ERROR', 'cannot target ally!');

      state.events.push({
        characterId: socket.id,
        ...event
      });
      state.takenAction[socket.id] = true;

      // 6) IF ALL THE PLAYERS HAVE TAKEN ACTION
      //    we want to apply the events and reset the 
      if(Object.values(state.takenAction).length == Object.values(state.players).length) {
        const applied = applyEvents();

        state.turn = state.turn == 0
        ? 1
        : state.turn == 1
        ? 0
        : null

        // if game is not over:
        nsp.emit('MATCH_END', { turn: state.turn, applied });
        // else 
        //   nsp.emit game.ending

        state.takenAction = {}
        state.events = []
      }
    });
    // disconnection
    socket.on('disconnect', () => {
      player = getPlayerFromSocket(socket);

      console.log('disconnected ', player);
      delete state.players[socket.id];
    })
  });

  function applyEvents() {
    let applied = [];
    const allEvents = state.events;

    for(let i = 0; i < allEvents.length; i++) {
      const event = allEvents[i];
      const {
        characterId,
        target,
        action,
      } = event;

      const character = state.players[characterId];

      if (!character) {
        console.log('character with id ' + characterId + ' is not an active socket');
        continue
      }

      const receiver = {...state.enemies, ...state.players}[target.id];

      if (!receiver) {
        console.log('receiver with id ' + target.id + ' is not in the state');
        continue
      }

      if (receiver.dead) {
        console.log('this receiver is dead, skipping ', target.id);
        continue
      }

      switch(action.type.toLowerCase()) {
        case 'attack':
          /*
            CHARACTER: Attack, Defense
            ATTACK: BaseDamage, CritStrike
          */
          const chosenAttack = character.entity.attacks[action.id];
          if (!chosenAttack) return socket.emit('ERROR', 'UNKNOWN ATTACK BY ID ' + action.id);

          damageFormula = chosenAttack.damageFormula(character, receiver);
        
          receiver.entity.takeDamage(character, receiver);

          applied.push({
            character: character.id,
            receiver: receiver.id,
            action: {
              ...action,
              outcome: damageFormula
            },
          });
          console.log('pushed to ', applied)
          break;
        default:
        
        socket.emit('ERROR', 'unknown action.type')
      }
    }

    return applied
  }

  function getPlayerFromSocket(socket) {
    var player = state.players[socket.id];

    return player
  }
  function getGameData() {
    return {
      level: {
        title: 'Foggy Woods',
      },
      players: state.players,
      enemies: state.enemies,
    };
  }
}
