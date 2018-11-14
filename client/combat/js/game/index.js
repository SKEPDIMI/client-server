var config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#000',
  parent: 'root',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 }
    }
  },
  scene: [
    bootScreen,
    playScreen,
  ],
};

var GameInterface = {
  game: new Phaser.Game(config),
}

GameInterface.game.scene.start('bootScreen')
