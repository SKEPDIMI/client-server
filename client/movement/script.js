var hasOwnProperty = Object.prototype.hasOwnProperty;

var spawnedUsers = {}

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
      create: create,
      update: update
  },
};

var game = new Phaser.Game(config);

var _this;
var t1;
var updateInterval = 1000;
var currentUser = null;

function preload ()
{
    _this = this;
    this.load.image('sky', '../public/assets/floor.jpg');
    this.load.spritesheet('dude', 
        '../public/assets/sprites.png',
        { frameWidth: 64, frameHeight: 96 }
    );
    t1 = Date.now();
}

function create ()
{
    Client.joinGame();
    Player.addAnimations();

    this.add.image(0, 0, 'sky').setOrigin(0, 0);
}

function update() {
    for(let id in spawnedUsers) {
        var player = spawnedUsers[id];

        if (player.movementQueue.length >= 1) {
            // removes first movement from queue and returns it to be used to update user
            movement = spawnedUsers[id].movementQueue.shift();
            player.update(movement);
        }
    }
}

function addPlayer(user_id, data) { // ADDED USER, SO UPDATED
    let isCurrentUser = user_id == Client.id
    spawnedUsers[user_id] = new Player(data, isCurrentUser);

    if (isCurrentUser) {
        currentUser = spawnedUsers[user_id];
    }
}

function updatePlayer(user_id, data) {
    spawnedUsers[user_id].update(data);
}

function removePlayer(id) {
    spawnedUsers[id].sprite.destroy();
    delete spawnedUsers[id];
}

// game.loop.actualFps

function lerp() {
    var FPS = Math.round(game.loop.actualFps);

}