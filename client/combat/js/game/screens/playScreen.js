const playScreen = {
  key: 'playScreen',
  targetHand: null,
  playerPlacingLine: {
    0: null,
    1: null,
    2: null,
    3: null,
  },
  enemyPlacingLine: {
    0: null,
    1: null,
    2: null,
    3: null,
  },
  preload() {
    // set the instance for global use
    playScreen.instance = this;
    initAssets();
  },
  create() {
    this.anims.create({
      key: 'smoke-puff',
      frames: this.anims.generateFrameNumbers('smokeDisappear', { start: 0, end: 40 }),
      frameRate: 70,
      repeat: 1,
    });
    // add background
    this.add.image(window.innerWidth/2, window.innerHeight/2, 'bg')
      .setDisplaySize(window.innerWidth, window.innerHeight);

    // init animation
    for(id in entityTypes) {
      entityTypes[id].init(this);
    }

    var name = $('#form #name-input').val();
    socket.emit('JOIN_GAME', name);
  },
  gameDataReceived(gameData) {
    // spawn in game data
    var allCharacters = Object.assign({}, gameData.players, gameData.enemies);

    for (id in allCharacters) {
      var character = allCharacters[id];

      if (character.id === socket.id) {
        h = character.entity.health;
        m = character.entity.maxHealth;
        p = h/m

        $('.health').html('HP \n' + h + ' / ' + m);
        $('#health-bar').animate({ width: (p*100)+'%'}, 500)
      }

      playScreen.spawn(character);
    }
  },
  // WILL TAKE CHARACTER DATA AND
  // FIND EMPTY SPOT IN THEIR CHARACTER TYPE LINE,
  // FIND THEIR COORDINATES IN THE LINE
  // CREATE A CHARACTER OBJECT & SPRITE AT THIS COORDINATE
  // SET THIS OBJECT AT THE PLACING LINE
  spawn(character) {
    let { entity } = character;
    let { entityData } = entity;

    let selected = entityTypes[entityData.id];

    if (!selected) {
      console.error('UNKNOWN ENTITY.ID: ', entityData.id);
    }

    const placingLine = entityData.enemy
      ? this.enemyPlacingLine
      : this.playerPlacingLine
    const emptySpotInLine = helpers.findEmptySpotInLine(placingLine);
    const coordinatesInLine = helpers.coordinatesForEntity(entity, emptySpotInLine);

    let spawned = selected(
      playScreen.instance,
      character,
      coordinatesInLine,
    );

    placingLine[emptySpotInLine] = spawned
  },
  addTargetHand() {
    var sprite;
    for(i in this.playerPlacingLine) {
      var entity = this.playerPlacingLine[i];
      if (entity) {
        sprite = entity.sprite;
        break;
      }
    }
    this.targetHand = playScreen.instance.add
      .image(sprite.x, sprite.y, 'selectTargetHand')
      .setDisplaySize(30, 30);
  },
  removeTargetHand() {
    if(this.targetHand) {
      this.targetHand.destroy();
    }
  },
  moveTargetHandTo(settings) {
    var newSide = settings.side;
    var newIndex = settings.index;
    var placingLine = newSide == 0
      ? this.playerPlacingLine
      : newSide == 1
        ? this.enemyPlacingLine
        : null;

    var character = placingLine[newIndex];

    if(!character) {
      throw new Error('NO CHARACTER AT PLACINGLINE[' + newIndex + ']');
    }

    this.targetHand.x = character.sprite.x - character.sprite.width
    this.targetHand.y = character.sprite.y
  },
  beginTurn(turn) {
    if (turn == 0) {
      GuiManager.setSelectionMode('TARGET');
    } else if (turn == 1) {
  
    }
  },
  animateEvents(events, i = 0) {
    if (!events.length) return
    var event = events[i];
    var nextEvent = events[i + 1];

    animateAction(event)
    .then(function() {
      if(nextEvent) {
        animateEvents(event, i+1);
      } else {
        applyEvents(events);
        GuiManager.setSelectionMode('TARGET');
      }
    });
  }
}

function applyEvents(events) {
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
      var damage = action.outcome.damage;

      if (receiver.id === socket.id) {
        // set our own HP level
      } else {
        receiver.takeDamage(damage);
      }
    } else {
      throw Error('unkown event action.type')
    }
  }
}

function animateAction(event) {
  var action = event.action;
  var animations = ANIMATIONS[action.type];
  animation = animations[action.id];
  
  return new Promise(function(resolve, reject) {
    animation(event)
    .then(resolve);
  });
}

// WILL RETURN AN ARRAY OF ALL THE 
// CHARACTERS IN THE ENEMY/PLAYER LINE
function getAllCharacters() {
  var r = [];
  var p = playScreen.playerPlacingLine;
  var e = playScreen.enemyPlacingLine;

  for (id in p) {
    if (p[id]) {
      r.push(p[id])
    }
  }
  for(id in e) {
    if (e[id]) {
      r.push(e[id])
    }
  }

  return r
}
function initAssets() {
  var gameInstance = playScreen.instance;

  gameInstance.load.setBaseURL('http://localhost:5000');
  gameInstance.load.image('bg', 'public/assets/img/bg-forest.png');
  gameInstance.load.image('selectTargetHand', 'public/assets/img/select-target-hand.png');
  gameInstance.load.spritesheet('smokeDisappear', 'public/assets/img/smoke.png', { frameWidth: 37.5, frameHeight: 37.5 });
  gameInstance.load.spritesheet('dwarf', 'public/assets/img/characters/dwarf.png', { frameWidth: 32, frameHeight: 31.7 });
  gameInstance.load.spritesheet('bat', 'public/assets/img/enemies/bat.png', { frameWidth: 32, frameHeight: 32 });
}

playScreen.removePlayer = function(id) {
  var gameInstance = playScreen.instance;
  var position;
  var player;
  for(i in playScreen.playerPlacingLine) {
    var p = playScreen.playerPlacingLine[i];
    if (p) {
      playScreen.playerPlacingLine[i] = null
      player = p
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