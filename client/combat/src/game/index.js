import Phaser from 'phaser'
import loadAssets from './preload/loadAssets';
import initiateEntities from './preload/initiateEntities';

const PLAYERS = {
  1: {
    name: 'skepdimi',
    type: 'dwarf',
  }
}

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

  Object.values(PLAYERS).forEach(data => {
    let player = this.entities['dwarf'](gameInstance,
      data.name,
      {
        x: window.innerWidth/4,
        y: window.innerHeight*(4/7)
      }
    );
  })
}

function update ()
{

}

var game = new Phaser.Game(config);

export default game
