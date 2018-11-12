import Phaser from 'phaser';
import _ from 'underscore';

import helpers from './helpers';

import loadAssets from './preload/loadAssets';
import initiateEntities from './preload/initiateEntities';

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

    /* Object.values(PLAYERS).forEach(data => {
      let player = this.entities['dwarf'](gameInstance,
        data.name,
        
      );
    })*/
  }

  function update ()
  {
    if(!this.currentPlayer && state.currentPlayer) {
      this.currentPlayer = state.currentPlayer;
      spawn(this.currentPlayer);
    }
    if(!_.isEqual(this.enemies, state.enemies)) {
      this.enemies = state.enemies;
      spawn(
        Object.values(state.enemies)[0],
      )
    }
  }

  function spawn(obj) {
    let { entity, name } = obj;

    let selected = gameInstance.entities[entity.id];

    if (!selected) {
      console.error('UNKNOWN ENTITY: ', entity.id);
    }

    new selected(
      gameInstance,
      name,
      helpers.coordinatesForEntity(obj, state)
    );
  }

  var game = new Phaser.Game(config);
}
