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
  gameData: {},
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
    playScreen.gameData = gameData;
    var players = gameData.players;
    var enemies = gameData.enemies;
    var allEntities = Object.assign({}, players, enemies);

    for (id in allEntities) {
      playScreen.spawn(allEntities[id]);
    }
  },
  spawn(mob) {
    let { entity } = mob;
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
      mob,
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

    var mob = placingLine[newIndex];

    if(!mob) {
      throw new Error('NO MOB AT PLACINGLINE[' + newIndex + ']');
    }

    this.targetHand.x = mob.sprite.x - mob.sprite.width
    this.targetHand.y = mob.sprite.y
  },
  beginTurn(turn) {
    if (turn == 0) {
      GuiManager.setSelectionMode('TARGET');
    } else if (turn == 1) {
  
    }
  },
}

function initAssets() {
  var gameInstance = playScreen.instance;

  gameInstance.load.setBaseURL('http://localhost:5000');
  gameInstance.load.image('bg', 'public/assets/img/bg-forest.png');
  gameInstance.load.image('selectTargetHand', 'public/assets/img/select-target-hand.png');
  gameInstance.load.spritesheet('dwarf', 'public/assets/img/characters/dwarf.png', { frameWidth: 32, frameHeight: 40 });
  gameInstance.load.spritesheet('bat', 'public/assets/img/enemies/bat.png', { frameWidth: 32, frameHeight: 32 });
}