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

    this.load.spritesheet('dude', 
        '../public/assets/sprites.png',
        { frameWidth: 64, frameHeight: 96 }
    );

    this.load.image("tiles", "../public/assets/tilesheet.png");
    this.load.tilemapTiledJSON("map", "../public/assets/map/my-first-map.json");

    t1 = Date.now();
}

function create ()
{
    var map = this.make.tilemap({ key: "map", tileWidth: 32, tileHeight: 32 });
    // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
    // Phaser's cache (i.e. the name you used in preload)
    var tileset = map.addTilesetImage("tilesheet", "tiles");

    // Parameters: layer name (or index) from Tiled, tileset, x, y
    this.grassLayer = map.createStaticLayer("grass", tileset, 0, 0);
    this.roadsLayer = map.createStaticLayer("roads", tileset, 0, 0);
    this.waterLayer = map.createStaticLayer("water", tileset, 0, 0).setCollisionByProperty({ collides: true });
    this.terrainLayer = map.createStaticLayer("terrain", tileset, 0, 0).setCollisionByProperty({ collides: true });

    const debugGraphics = this.add.graphics().setAlpha(0.75);
    this.terrainLayer.renderDebug(debugGraphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });

    Client.joinGame();
    Player.addAnimations();
}

function update() {
    for(let id in spawnedUsers) {
        var player = spawnedUsers[id];

        if (player.movementQueue.length >= 1) {
            // removes first movement from queue and returns it to be used to update user
            movement = spawnedUsers[id].movementQueue.shift();
            player.update(movement);
        }
        if (player.isCurrentUser) {
          _this.cameras.main.centerOn(player.sprite.x, player.sprite.y);
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