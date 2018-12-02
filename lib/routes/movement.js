const helpers = require('../helpers');
const DIRECTIONS = ['left', 'right', 'up', 'down'];

module.exports = io => {
  var nsp = io.of('/movement');
  var usersPool = {};
  
  nsp.on('connect', (socket) => {
    socket.on('join_game', function() {
      if (Object.keys(usersPool).length == 0) { // If there are no users in our list, begin the LOOP with this one!
        usersPool[socket.id] = helpers.generateUserData();
        beginLoop();
      } else { // Or just add to the users list
        usersPool[socket.id] = helpers.generateUserData();
      }
    });
    socket.on('move', function(direction) {
      if(!DIRECTIONS.includes(direction)) return

      usersPool[socket.id].moving = true;
      usersPool[socket.id].direction = direction;
    });
    socket.on('move_stop', function() {
      usersPool[socket.id].moving = false;
    });
  
    socket.on('disconnect', function(){
      socket.emit('user_disconnect', socket.id);
      delete usersPool[socket.id];
    });
  });

  // used to find deltaTime on every server loop
  var t1 = Date.now();
  var t2 = Date.now();
  // interval to send game state
  const serverLoopInterval = 500;
  // interval to update game state
  const positionUpdateInterval = Math.round(serverLoopInterval/5);
  // if the `positionUpdateInterval` is 300 (.3s mil) and `serverLoopInterval` is 1000 (1sec),
  // we only want 3 updates per sec.
  // so then, the max movementQueue.length = serverLoopInterval/positionUpdateInterval
  const maxMovementQueueLength = Math.round(serverLoopInterval/positionUpdateInterval);
  
  let gameLoop = false;
  // console.log(`SERVER_LOOP_INTERVAL = ${serverLoopInterval} \nPOSITION_UPDATE_INTERVAL = ${positionUpdateInterval} \n MAX_QUEUE = ${maxMovementQueueLength}`)
  function beginLoop() {
    // game already running ?
    if (!!gameLoop) return false
    
    // GAME LOOP
    gameLoop = setInterval(() => {
      let deltaTime = Date.now() - t1;
      let deltaTimeUpdate = Date.now() - t2;
      // If there are no users, stop the looping!
      if (Object.keys(usersPool).length == 0) {
        stopLoop();
      }
      // update positions of users every POSITION_UPDATE_INTERVAL
      if (deltaTimeUpdate >= positionUpdateInterval) {
        t2 = Date.now();

        for(let i in usersPool) {
          player = usersPool[i];
  
          let movementStack = {
            x: player.x,
            y: player.y,
            direction: player.direction,
            moving: player.moving
          }

          if(player.moving) {
            console.log('moving to ', player.direction);
            /* PLEASE MAKE SURE THEY ARE NOT OWN OF BOUNDS OR COLLIDING HERE PLEASE */
            let distance = player.speed * (positionUpdateInterval/1000);
  
            if (player.direction == 'up') {
              movementStack.y -= distance;
            } else if (player.direction == 'down') {
              movementStack.y += distance;
            } else if (player.direction == 'left') {
              movementStack.x -= distance;
            } else if (player.direction == 'right') {
              movementStack.x += distance;
            }
          }
  
          usersPool[i] = {...player, ...movementStack};
  
          // push new movement stack
          usersPool[i].movementQueue.push(movementStack);
          // limit the length to only the movement stacks being sent on every `serverLoopInterval`
          usersPool[i].movementQueue = usersPool[i].movementQueue.slice(-maxMovementQueueLength);
        }
      }
      // send the game state every DELTA_TIME
      if (deltaTime >= serverLoopInterval) {
        t1 = Date.now();
        nsp.emit('usersPool', usersPool);
      }
    }, 10);
  }
  function stopLoop() {
    clearInterval(gameLoop);
    gameLoop = false;

    console.log("stopped server LOOP");
  }
}