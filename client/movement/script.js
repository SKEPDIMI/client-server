var hasOwnProperty = Object.prototype.hasOwnProperty;

var users_list = {}

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
    for(let id in users_list) {
        var player = users_list[id];

        if (player.movementQueue.length == 0) {
            continue
        }

        // set user's state to the first stack in the movementQueue
        player.update(player.movementQueue[0]);
        // remove stack we just updated to
        users_list[id].movementQueue = player.movementQueue.slice(1);
    }
}

function addPlayer(user_id, data) { // ADDED USER, SO UPDATED
    users_list[user_id] = new Player(data);

    if (user_id == Client.id) {
        currentUser = users_list[user_id];
    }
}

function updatePlayer(user_id, data) {
    users_list[user_id].update(data);
}

function removePlayer(id) {
    users_list[id].sprite.destroy();
    delete users_list[id];
}

// game.loop.actualFps

function lerp() {
    var FPS = Math.round(game.loop.actualFps);

}