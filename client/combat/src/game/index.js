import Phaser from 'phaser';
import _ from 'underscore';

import { getEntityType } from '../redux/actions';
import helpers from './helpers';

import loadAssets from './preload/loadAssets';
import initiateEntities from './preload/initiateEntities';

_.mixin({
  hasSameKeys: function(a, b) {
    return Object.keys(a).length === Object.keys(b).length && Object.keys(a).every(k => b.hasOwnProperty(k))
  }
});

export default (store) => {
  let state = {}
  store.subscribe(() => {
    state = store.getState()
  });

  // access game instance from everywhere
  var gameInstance;

  var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'root',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 200 }
      }
    },
    scene: {
      preload,
      create,
      update
    }
  };

  function preload ()
  {
    gameInstance = this;

    loadAssets(gameInstance);
  }
  
  function create ()
  {
    initiateEntities(gameInstance);
    
    gameInstance.bg = gameInstance.add.image(window.innerWidth/2, window.innerHeight/2, 'bg')
    gameInstance.bg.setDisplaySize(window.innerWidth, window.innerHeight);
  }

  function update ()
  {
    let result = getSpawnedDifference();

    for(let i in result.spawn) {
      spawn(i, result.spawn[i])
    }
    /*
      for(let i in result.despawn) {
        despawn(i, result.despawn[i])
      }
    */
  }

  function spawn(id, entity) {
    let { entityData } = entity;

    let selected = gameInstance.entities[entityData.id];

    if (!selected) {
      console.error('UNKNOWN ENTITY.ID: ', entityData.id);
    }

    let spawned = new selected(
      gameInstance,
      entity,
      helpers.coordinatesForEntity(entity, state),
    );

    store.dispatch(getEntityType(id, spawned))
  }

  function getSpawnedDifference() {
    let {
      players,
      enemies,
    } = state.gameReducer;
    let {
      enemyEntities,
      playerEntities,
    } = state.phaserReducer;

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
    console.log('r ', result)
    return result
  }

  var game = new Phaser.Game(config);
}
