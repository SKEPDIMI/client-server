var users_list = {}

var config = {
  type: Phaser.AUTO,
  width: 400,
  height: 200,
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
var _this;

function preload ()
{
    _this = this;
    this.load.image('sky', 'assets/floor.jpg');
    this.load.spritesheet('dude', 
        'assets/sprites.png',
        { frameWidth: 64, frameHeight: 96 }
    );
}

function create ()
{
    socket_script()
    this.add.image(0, 0, 'sky').setOrigin(0, 0);
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 7 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 8, end: 15 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('dude', { start: 16, end: 23 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('dude', { start: 24, end: 31 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'idle',
        frames: [ {key: 'dude', frame: 25} ],
        frameRate: 10,
        repeat: 1
    });
}

function addPlayer(user_id, data) { // ADDED USER, SO UPDATED
    users_list[user_id] = _this.physics.add.sprite(data.x, data.y, 'dude');
    player = users_list[user_id];

    player.setBounce(0.1);
    player.setCollideWorldBounds(true);
}

function updatePlayer(user_id, data) {
    player = users_list[user_id];

    if (data.moving) {
        switch (data.moving) {
            case 'left':
                player.setVelocityX(-200);
                player.anims.play('left', true);
                break;
            case 'right':
                player.setVelocityX(200);
                player.anims.play('right', true);
                break;
            case 'up':
                player.setVelocityY(-200);
                player.anims.play('up', true);
                break;
            case 'down':
                player.setVelocityY(200);
                player.anims.play('down', true);
                break;
        }
    } else {
        var { x, y } = data
        player.x = x
        player.y = y
        player.setVelocityX(0);
        player.setVelocityY(0);
        player.anims.play('idle');
    }
}

function removePlayer(id) {
    users_list[id].destroy();
    delete users_list[id];
}

function userStop (id) {
    player = users_list[id];
    player.setVelocityX(0);
    player.setVelocityY(0);
    player.anims.play('idle');
}