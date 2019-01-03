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
 ***
 * event = {
 *   action: {
 *     type: String,
 *     id: Number,
 *   }
 *   characterId: Number,
 *   receiverId: Number
 * }
 * 
 * appliedEvent = {
 *   character: Number,
 *   receiver: Number,
 *   action: {
 *     type: String,
 *     id: Number,
 *     outcome: Object
 *   },
 *  }
 */
const _ = require('underscore');
const async = require('async');
const uuid = require('uuid/v4')
const initialState = require('./data/initialState');
const ALL_POTIONS = require('./data/potions');
const ALL_ENTITIES = require('./entities');

// The Game State!~
var state = {...initialState}

// Generate enemies
for (let i = 0; i < 4; i++) {
  let id = uuid();
  state.enemies[id] = {
    id,
    entity: ALL_ENTITIES['entity-1']()
  }
}

let nsp;

module.exports = io => {
  console.log('SERVER...STATUS = ', 'initiating combat namespace');

  nsp = io.of('/combat');

  // all new connections
  nsp.on('connection', (socket) => {
    // redux binding
    // socket.on('CREATE_CHARACTER', (username, password) => {
    //   authentication.createUser(username, password)
    //   .then(() => {

    //   })
    //   .catch((err) => {
    //     res(err)
    //   });
    // }, res);

    socket.on('JOIN_GAME', (name) => {
      // first player will be an adventurer
      const Entity = Object.keys(state.players).length > 0 
        ? ALL_ENTITIES['entity-0']
        : ALL_ENTITIES['entity-2']

      const player = {
        id: socket.id,
        entity: Entity({
          name
        })
      };

      const l = Object.keys(state.players).length

      if (l > 3) return console.log('GAME IS FULL');

      state.players[socket.id] = player;

      // if this user was the first
      if (!gameLoop) {
        state = {...initialState}
        beginLoop();
      }
    });

    socket.on('ACTION', (event) => {
      // make sure that the socket has player data attached to it
      var player = getPlayerFromSocket(socket);
      if (!player) return console.log('ERROR', 'you are not in the match!');

      if (state.turn != 0) return socket.emit('ERROR', 'it is the enemy turn')
      // make sure that IF THE USER ALREADY CHOSE AN ACTION IN THIS TURN we do not continue
      if (player.entity.selectionStatus == 1) return socket.emit('ERROR', 'player already submitted an action!')

      /* TYPE CHECKING */

      if (typeof event != 'object') return

      const { action, receiverId } = event;

      if (typeof receiverId != 'string') return socket.emit('ERROR', 'invalid receiverId')
      if (typeof action != 'object') return socket.emit('ERROR', 'no event.action')
      if (typeof action.type != 'string') return socket.emit('ERROR', 'no action.type')
      if (!action.hasOwnProperty('id')) return socket.emit('ERROR', 'no action.id')

      /* END OF TYPE CHECKING */

      const receiver = findCharacterById(receiverId);

      // IF THE RECEIVER THE PLAYER REFERED TO DOES NOT EXIST IN THE GAME STATE
      // we will not continue
      if (!receiver) return socket.emit('ERROR', 'character by id ' + receiverId + ' was not found');
      
      switch (action.type.toLowerCase()) {
        case 'attack':
          if (receiver.id === socket.id) return socket.emit('ERROR', 'player cannot attack self!');
          else if (!receiver.entity.entityData.enemy) return socket.emit('ERROR', 'cannot target ally!');
          break;
        case 'potion':
          if (receiverId !== socket.id && receiver.inventoryIsFull) return socket.emit('ERROR', 'This player\'s inventory is full')
          else if (receiver.entity.enemy) return socket.emit('ERROR', 'cannot give an enemy a potion!')
          break;
      }
      
      state.events.push({ characterId: socket.id, ...event });
      player.entity.selectionStatus = 1
    });
    // disconnection
    socket.on('disconnect', () => {
      // remove this player from the state.players
      delete state.players[socket.id];

      if (!Object.values(state.players)) {
        stopLoop();
      }
    })
  });
}

const applyEvents = () => {
  let applied = [];
  const allEvents = state.events;

  for(let i = 0; i < allEvents.length; i++) {
    const event = allEvents[i];
    const {
      characterId,
      receiverId,
      action,
    } = event;
    console.log(`characterId in turn ${state.turn} is `, characterId)
    const character = {...state.players, ...state.enemies}[characterId];

    if (!character) {
      console.log('character with id ' + characterId + ' is not an active socket');
      continue
    }

    let receiver = findCharacterById(receiverId);

    if (!receiver) {
      console.log('receiver with id ' + receiverId + ' is not in the state');
      continue
    }

    if (receiver.dead) {
      console.log('this receiver is dead, skipping ', receiverId);
      continue
    }

    switch(action.type.toLowerCase()) {
      case 'attack':
        /*
          CHARACTER: Attack, Defense
          ATTACK: BaseDamage, CritStrike
        */
        const chosenAttack = character.entity.attacks[action.id];
        if (!chosenAttack) throw new Error('UNKNOWN ATTACK BY ID ' + action.id);

        var attackOutcome = chosenAttack.damageFormula(character, receiver);
        receiver.entity.takeDamage(attackOutcome.damage);

        applied.push({
          character: character.id,
          receiver: receiver.id,
          action: {
            ...action,
            outcome: attackOutcome
          },
        });
        break;
      case 'potion':
       let inventory = character.entity.inventory;
       let itemId;
       let chosenItem;

        for (uid in inventory) {
          let item = inventory[uid];
          if (item.id == action.id && item.type == 'potion') {
            itemId = uid
            chosenItem = item;
            break;
          }
        }
        if (!chosenItem) return socket.emit('ERROR', 'UNKNOWN POTION IN INVENTORY BY ID ' + action.id);

        const potion = ALL_POTIONS[chosenItem];
        if (!potion) return socket.emit('ERROR', 'Potion by this id does not exist!');

        if (receiver.id === character.id) {
          const {
            updatedEntity,
            outcome,
          } = potion.effect(receiver);

          applied.push({
            character: character.id,
            receiver: receiver.id,
            action: {
              ...action,
              outcome
            },
          });

          // update player entity with new stats
          receiver.entity = updatedEntity
        } else {
          let addedToInventory = receiver.entity.addToInventory({ id: chosenPotionId, type: 'potion' });

          if (addedToInventory) {
            character.entity.removeFromInventory(itemId)
          }

          applied.push({
            character: character.id,
            receiver: receiver.id,
            action: {
              type: 'gift',
              id: potion,
            }
          });
        }
        
        break;
      default:
        throw new Error('Unknown action.type ', action.type);
    }
  }

  return applied
}

const getPlayerFromSocket = (socket) => {
  var player = state.players[socket.id];

  return player
}

const findCharacterById = (characterId) => {
  for (let id in state.enemies) {
    if (id == characterId) return state.enemies[id]
  }
  for (let id in state.players) {
    if (id === characterId) return state.players[id]
  }

  return null
}

const enemyTurn = () => {
  let { enemies } = state;

  // for each enemy:
  // choose a player to attack OR another action depending on the entity
  // wait a random amount of seconds depending on their skill level
  // set selectionStatus to 1
  // apply the events

  // after that, the game loop handles the rest
  async.each(Object.values(enemies), (enemy, next) => {
    let randomTime = Math.floor(Math.random() * 4500); // 0 to 4.5 seconds to wait
    let players = Object.values(state.players);
    let player = players[Math.floor(Math.random() * players.length)];
    let attacks = _.pairs(enemy.entity.attacks);
    let selectedAttack = attacks[Math.floor(Math.random() * attacks.length)];

    let event = {
      characterId: enemy.id,
      receiverId: player.id,
      action: {
        type: 'attack',
        id: selectedAttack[0],
      },
    };

    setTimeout(() => {
      enemy.entity.selectionStatus = 1;
      state.events.push(event);
      next();
    }, randomTime);
  }, () => {
    // console.log('All enemies have chosen!');
  });
}

var t1 = Date.now();
var t2 = Date.now();

const serverLoopInterval = 1000;
const gameUpdateInterval = Math.round(serverLoopInterval/4);

let gameLoop = false;

const beginLoop = () => {
  // game already running ?
  if (!!gameLoop) return false
  
  // MAIN GAME LOOP
  gameLoop = setInterval(() => {
    let deltaTime = Date.now() - t1;
    let deltaTimeUpdate = Date.now() - t2;
    if (deltaTime > serverLoopInterval) {
      t1 = Date.now()

      nsp.emit('GAME_DATA', state);
    } else if (deltaTimeUpdate > gameUpdateInterval) {
      t2 = Date.now();

      if (state.turn == 0) {
        var takenAction = Object.values(state.players).filter(player => player.entity.selectionStatus === 1);

        if(takenAction.length >= Object.values(state.players).length) {
          const applied = applyEvents();

          // record the events of the 
          state.turnEvents[state.turn] = [
            ...applied
          ]

          // reset events
          state.events = []

          // if game is not over:
          state.turn += 1
          
          // console.log('ENEMY TURN!!!')
          enemyTurn();
          // else 
          //   nsp.emit game.ending
        }
      } else {
        var takenAction = Object.values(state.enemies).filter(enemy => enemy.entity.selectionStatus === 1);

        if (takenAction.length >= Object.values(state.enemies).length) {
          // console.log('All enemies chose here in the loop');
          const applied = applyEvents();

          // record the events of the 
          state.turnEvents[state.turn] = [
            ...applied
          ]

          // reset events
          state.events = []

          // if game is not over:
          state.turn += 1
          
          // console.log('PLAYER TURN!!!')
        }
      }
    }
  }, 50);
}

const stopLoop = () => {
  if (!gameLoop) return
  clearInterval(gameLoop);
  gameLoop = null;
}