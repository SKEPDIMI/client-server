const config = {
  type: Phaser.AUTO, // Which renderer to use
  width: 800, // Canvas width in pixels
  height: 600, // Canvas height in pixels
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image("tiles", "../public/assets/tilesheet.png");
  this.load.tilemapTiledJSON("map", "../public/assets/map/my-first-map.json");

}

function create() {
  // When loading a CSV map, make sure to specify the tileWidth and tileHeight!
  const map = this.make.tilemap({ key: "map", tileWidth: 32, tileHeight: 32 });
console.log('map!')
  // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
  // Phaser's cache (i.e. the name you used in preload)
  const tileset = map.addTilesetImage("tilesheet", "tiles");

  // Parameters: layer name (or index) from Tiled, tileset, x, y
  const grassLayer = map.createStaticLayer("grass", tileset, 0, 0);
  const roadsLayer = map.createStaticLayer("roads", tileset, 0, 0);
  const waterLayer = map.createStaticLayer("water", tileset, 0, 0).setCollisionByProperty({ collides: true });
  const terrainLayer = map.createStaticLayer("terrain", tileset, 0, 0).setCollisionByProperty({ collides: true });

  // const debugGraphics = this.add.graphics().setAlpha(0.75);
  // worldLayer.renderDebug(debugGraphics, {
  //   tileColor: null, // Color of non-colliding tiles
  //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
  //   faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
  // });
}

function update(time, delta) {
  // Runs once per frame for the duration of the scene
}