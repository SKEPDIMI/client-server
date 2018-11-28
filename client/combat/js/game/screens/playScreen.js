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
      playScreen.spawn(allCharacters[id]);
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

    let spawned = new selected(
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
        console.log('DONE WITH ANIMATIONS LOOP!')
      }
    })
  }
}

function animateAction(event) {
  var allCharacters = getAllCharacters();
  var action = event.action;
  var characterId = event.character;
  var receiverId = event.receiver;

  var character = allCharacters.find(function(c) { return c.id === characterId});
  var receiver = allCharacters.find(function(c) { return c.id === receiverId});

  if (!character || !receiver) {
    throw new Error('Missing character or receiver when animating')
  }

  return new Promise(function(resolve, reject) {
    character.animate(action)
    .then(resolve)
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
  gameInstance.load.spritesheet('dwarf', 'public/assets/img/characters/dwarf.png', { frameWidth: 32, frameHeight: 31.7 });
  gameInstance.load.spritesheet('bat', 'public/assets/img/enemies/bat.png', { frameWidth: 32, frameHeight: 32 });
}