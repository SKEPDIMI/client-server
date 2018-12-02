const playScreen = {
  key: 'playScreen',
  ready: false,
  gameState: {
    enemies: {},
    players: {},
    turn: null,
  },
  targetHand: null,
  playerPlacingLine: {
    0: {
      character: false,
      next: 1,
      prev: 3,
    },
    1: {
      character: false,
      next: 2,
      prev: 0,
    },
    2: {
      character: false,
      next: 3,
      prev: 1,
    },
    3: {
      character: false,
      next: 0,
      prev: 2,
    },
  },
  enemyPlacingLine: {
    0: {
      character: false,
      next: 1,
      prev: 3,
    },
    1: {
      character: false,
      next: 2,
      prev: 0,
    },
    2: {
      character: false,
      next: 3,
      prev: 1,
    },
    3: {
      character: false,
      next: 0,
      prev: 2,
    },
  },
  preload() {
    /*
      SET THE PHASER.GAME INSTANCE
      FOR GLOBAL USE!!!
    */
    playScreen.instance = this;
    initAssets();
  },
  create() {
    var gameInstance = playScreen.instance;

    gameInstance.anims.create({
      key: 'smoke-puff',
      frames: gameInstance.anims.generateFrameNumbers('smokeDisappear', { start: 0, end: 40 }),
      frameRate: 70,
      repeat: 1,
    });
    // add background
    gameInstance.add.image(window.innerWidth/2, window.innerHeight/2, 'bg')
      .setDisplaySize(window.innerWidth, window.innerHeight);

    // init animations for entities
    for(id in entityTypes) {
      entityTypes[id].init();
    }

    var name = $('#form #name-input').val();
    socket.emit('JOIN_GAME', name);

    playScreen.ready = true
  },
}

playScreen.applyEvents = function(events) {
  var allCharacters = getAllCharacters();

  for(i = 0; i < events.length; i++) {
    event = events[i];
    var action = event.action;
    
    var agentId = event.character;
    var receiverId = event.receiver;
    var agent = allCharacters.find(function(c) { return c.id === agentId});
    var receiver = allCharacters.find(function(c) { return c.id === receiverId});

    if (!agent || !receiver) {
      throw Error('missing agent or receiver');
    }

    if (action.type == 'attack') {
    } else {
      throw Error('unkown event action.type')
    }
  }
}

function animateAction(event) {
  var action = event.action;
  var animations = ANIMATIONS[action.type];
  animation = animations[action.id];

  if(typeof animation != 'function') throw Error('Unknown animation...');
  
  return new Promise(function(resolve, reject) {
    animation(event)
    .then(resolve)
    .catch(function(e) {
      throw Error(e);
    });
  });
}

// WILL RETURN AN ARRAY OF ALL THE 
// CHARACTERS IN THE ENEMY/PLAYER LINE
function getAllCharacters() {
  var r = [];
  var p = playScreen.gameState.players;
  var e = playScreen.gameState.enemies;

  for (id in p) {
    r.push(p[id])
  }
  for(id in e) {
    r.push(e[id])
  }

  return r
}
function initAssets() {
  var gameInstance = playScreen.instance;
  var assetsFolder = 'public/assets'
  
  gameInstance.load.setBaseURL('http://localhost:5000');

  gameInstance.load.image('bg', assetsFolder + '/img/bg-forest.png');
  gameInstance.load.image('selectTargetHand', assetsFolder + '/img/select-target-hand.png');
  gameInstance.load.image('okIcon', assetsFolder + '/img/ok.png');
  gameInstance.load.image('pendingIcon', assetsFolder + '/img/pending.png');

  gameInstance.load.spritesheet('smokeDisappear', assetsFolder+ '/img/smoke.png', { frameWidth: 37.5, frameHeight: 37.5 });
  gameInstance.load.spritesheet('dwarf', assetsFolder + '/img/characters/dwarf.png', { frameWidth: 32, frameHeight: 31.7 });
  gameInstance.load.spritesheet('bat', assetsFolder + '/img/enemies/bat.png', { frameWidth: 32, frameHeight: 32 });
}

playScreen.despawnCharacter = function(id) {
  var gameInstance = playScreen.instance;
  var position;
  var player;
  for(i in playScreen.playerPlacingLine) {
    var character = playScreen.playerPlacingLine[i].character;

    if (character && character.id == id) {
      playScreen.playerPlacingLine[i].character = null
      player = p.character
      position = i

      break;
    }
  }

  if(!player || !position) return

  // add smoke and remove them...
  var playerSprite = player.sprite;
  x = playerSprite.x + (playerSprite.width / 2);
  y = playerSprite.y + (playerSprite.height / 2);
  var text;
  EventChain()
  .then(function() {
    // get rid of their nametag
    player.nameTag.destroy();
    // puff of smoke
    gameInstance.add.sprite(x, y, 'smokeDisappear').setDisplaySize(120, 180).play('smoke-puff');
    // text about player leaving
    text = playScreen.instance.add.text(
      playerSprite.x - playerSprite.width,
      playerSprite.y - playerSprite.height - 20,
      player.entity.name + ' left the match',
      { fontSize: '17px', fill: '#fff' }
    );
    text.x -= (text.width/2)
  })
  .wait(100)
  .then(function() {
    // remove the play
    playerSprite.destroy();
  })
  .wait(2500)
  .then(function() {
    playScreen.instance.add.tween({
      targets: text,
      ease: 'Sine.easeInOut',
      duration: 1000,
      delay: 0,
      y: text.y - 20,
      alpha: {
        getStart: () => 1,
        getEnd: () => 0
      },
      onComplete: function() {
        text.destroy();
      }
    });
  })
  .play();

  // update GUI target if it was the user
  if (GuiManager.currentTargetSide == 0 && GuiManager.currentTargetIndex == position) {
    if (GuiManager.selectionMode !== 'TARGET') {
      GuiManager.setSelectionMode('TARGET');
    }
  }
}

playScreen.spawn = function(character) {
  let { entity } = character;
  let { entityData } = entity;

  let entityType = entityTypes[entityData.id];

  if (!entityType) {
    console.error('UNKNOWN ENTITY.ID: ', entityData.id);
  }
  // place them in our game state
  var gameStateCategory;
  var placingLine;

  if (entityData.enemy) {
    gameStateCategory = playScreen.gameState.enemies;
    placingLine = playScreen.enemyPlacingLine;
  } else {
    gameStateCategory = playScreen.gameState.players
    placingLine = playScreen.playerPlacingLine;
  }
  var emptySpotInLine = helpers.findEmptySpotInLine(placingLine);
  
  // spawn the player and place them in the gameState
  gameStateCategory[character.id] = entityType(
    character,
    helpers.coordinatesForEntity(entity, emptySpotInLine),
  );

  console.log('added new character to game state!');

  // reference the spawned player in their placing line
  placingLine[emptySpotInLine].character = gameStateCategory[character.id]

  return gameStateCategory[character.id]
}

playScreen.addTargetHand = function() {
  var sprite;
  for(i in playScreen.playerPlacingLine) {
    var entity = playScreen.playerPlacingLine[i].character;
    if (entity) {
      sprite = entity.sprite;
      break;
    }
  }

  playScreen.targetHand = playScreen.instance.add
    .image(sprite.x, sprite.y, 'selectTargetHand')
    .setDisplaySize(30, 30);
}

playScreen.removeTargetHand = function() {
  if(playScreen.targetHand) {
    playScreen.targetHand.destroy();
  }
}

playScreen.animateEvents = function(events, i = 0) {
  var event = events[i];
  var nextEvent = events[i + 1];

  animateAction(event)
  .then(function() {
    if(nextEvent) {
      playScreen.animateEvents(events, i+1);
    } else {
      playScreen.applyEvents(events);
    }
  });
}
playScreen.beginTurn = function(turn) {
  if (turn == 0) {
    GuiManager.setSelectionMode('TARGET');
  } else if (turn == 1) {

  }
}

playScreen.gameStateReceived = function (networkGameState) {
  var localGameState = playScreen.gameState;
  
  // PLAYER UPDATING SECTION
  var allPlayersOnNetworkState = networkGameState.players;
  var allPlayersInGameState = localGameState.players;

  // look for players in GAME_STATE NOT in network, despawn them
  for (id in allPlayersInGameState) {
    var playerInNetwork = allPlayersOnNetworkState[id];

    if(!playerInNetwork) {
      // ORIGINAL GAME STATE IS MANIPULATED HERE
      playScreen.despawnCharacter(id);
    }
  }

  // update players in GAME_STATE FROM network
  for (id in allPlayersOnNetworkState) {
    var playerOnNetwork = allPlayersOnNetworkState[id];
    var playerInLocal = allPlayersInGameState[id];

    // this player needs to be spawned
    if (!playerInLocal) {
      // ORIGINAL GAME STATE IS MANIPULATED HERE
      playerInLocal = playScreen.spawn(playerOnNetwork)
    }

    // set the player's health
    playerInLocal.setHealth(playerOnNetwork.entity.health);

    // set the player's selectionStatus
    playerInLocal.setStatusIcon(playerOnNetwork.entity.selectionStatus);
    playerInLocal.entity.selectionStatus = status

    // set the current player's HP bar
    if (playerInLocal.id === socket.id) {
      GuiManager.setHP(playerInLocal);
    }
  }
  // ENEMY UPDATING SECTION
  var allEnemiesInNetworkState = networkGameState.enemies;
  var allEnemiesInLocalState = localGameState.enemies;

  // look for players in GAME_STATE NOT in network, despawn them
  for (id in allEnemiesInLocalState) {
    var enemyOnNetwork = allEnemiesInNetworkState[id];

    if(!enemyOnNetwork) {
      // ORIGINAL GAME STATE IS MANIPULATED HERE
      playScreen.despawnCharacter(id);
    }
  }

  // update enemies in GAME_STATE FROM network
  for (id in allEnemiesInNetworkState) {
    var enemyOnNetwork = allEnemiesInNetworkState[id];
    var enemyInLocal = allEnemiesInLocalState[id];

    // this player needs to be spawned
    if (!enemyInLocal) {
      enemyInLocal = playScreen.spawn(enemyOnNetwork).updateHealthBar();
    }

    var healthOnNetwork = enemyOnNetwork.entity.health;

    enemyInLocal
      .setHealth(healthOnNetwork)
      // .updateHealthBar();
  }

  /*
    EVENTS UPDATING
  */

  // the network is at another turn
  if (localGameState.turn != networkGameState.turn) {
    // we have not JUST joined the match
    if (localGameState.turn != null) {
      // show us the events of the last match
      var appliedEvents = networkGameState.turnEvents[localGameState.turn];

      for(id in playScreen.gameState.players) {
        var player = playScreen.gameState.players[id];
        player.removeStatusIcon();
      }

      playScreen.animateEvents(appliedEvents);
    }

    localGameState.turn = networkGameState.turn
    
    if (localGameState.turn % 2) {
      console.log('WAITING FOR ENEMIES')
    } else {
      console.log('YEP, ITS GAMER TIME')
      GuiManager.setSelectionMode('TARGET');
    }
  }
}

playScreen.moveTargetHandTo = function (settings) {
  var newSide = settings.side;
  var newIndex = settings.index;
  var placingLine = newSide == 0
    ? playScreen.playerPlacingLine
    : newSide == 1
      ? playScreen.enemyPlacingLine
      : null;

  var character = placingLine[newIndex].character;

  if(!character) {
    throw new Error('NO CHARACTER AT PLACINGLINE[' + newIndex + ']');
  }

  playScreen.targetHand.x = character.sprite.x - character.sprite.width
  playScreen.targetHand.y = character.sprite.y
}
