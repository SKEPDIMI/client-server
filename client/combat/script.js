var config = {
  type: Phaser.AUTO,
  width: 500,
  height: 400,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 0 }
      }
  },
  scene: {
      preload: preload,
      create: create
  }
};

var game = new Phaser.Game(config);

function preload() {
  // load image
}

function create() {
  // create images
}
