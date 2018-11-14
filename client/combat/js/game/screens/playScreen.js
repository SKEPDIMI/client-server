const playScreen = {
  key: 'playScreen',
  preload() {
    // set the instance for global use
    playScreen.instance = this;
    initAssets();
  },
  create() {
    // init animation
    for(id in entityTypes) {
      entityTypes[id].init(this);
    }

    // add background
    this.add.image(window.innerWidth/2, window.innerHeight/2, 'bg')
      .setDisplaySize(window.innerWidth, window.innerHeight);

    // spawn in game data
    var gameData = playScreen.gameData;
    var players = gameData.players;
    var enemies = gameData.enemies;
    var ents = Object.assign({}, players, enemies);

    for (id in ents) {
      playScreen.spawn(ents[id]);
    }
  },
  update() {
    let result = playScreen.getSpawnedDifference();

    for(let id in result.spawn) {
      // playScreen.spawn(result.spawn[id])
    }
    /*
      for(let i in result.despawn) {
        despawn(i, result.despawn[i])
      }
    */
  },
  spawn(entity) {
    let { entityData } = entity;

    let selected = entityTypes[entityData.id];

    if (!selected) {
      console.error('UNKNOWN ENTITY.ID: ', entityData.id);
    }

    let spawned = new selected(
      playScreen.instance,
      entity,
      helpers.coordinatesForEntity(entity),
    );

    // playScreen.store.dispatch(getEntityType(id, spawned))
  },
  getSpawnedDifference() {
    /*
    let {
      players,
      enemies,
    } = playScreen.state.gameReducer;
    let {
      enemyEntities,
      playerEntities,
    } = playScreen.state.phaserReducer;

    let inState = {
      ...enemies,
      ...players,
    }
    let spawned = {
      ...playerEntities,
      ...enemyEntities,
    }
    
    let result = {
      spawn: {},
      despawn: {},
    }

    // if we have the same id's in spawned and state, return empty result
    if(_.hasSameKeys(inState, spawned)) {
      return result
    }
    
    for(let id in inState) {
        if (!_.has(spawned, id)) {
            result.spawn[id] = inState[id]
        }
    }
    for (let id in spawned) {
        if (!_.has(inState, id)) {
            result.despawn[id] = spawned[id]
        }
    }
    return result
    */
    return { spawn: {} }
  }
}

function initAssets() {
  var gameInstance = playScreen.instance;

  gameInstance.load.setBaseURL('http://localhost:5000');
  gameInstance.load.image('bg', 'public/assets/img/bg-forest.png');
  gameInstance.load.image('selectTargetHand', 'public/assets/img/select-target-hand.png');
  gameInstance.load.spritesheet('dwarf', 'public/assets/img/characters/dwarf.png', { frameWidth: 32, frameHeight: 40 });
  gameInstance.load.spritesheet('bat', 'public/assets/img/enemies/bat.png', { frameWidth: 32, frameHeight: 32 });
}