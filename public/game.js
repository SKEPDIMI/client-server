var users_list = {}

var config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
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

function removePlayer(id) {
    player = users_list[id];
    player.destroy();
    delete  users_list[id];
}

function userMove(user_id, direction) {
    player = users_list[user_id];

    if (direction == 'left')
    {
        player.setVelocityX(-200);
        player.anims.play('left', true);
    }
    else if (direction == 'right')
    {
        player.setVelocityX(200);
        player.anims.play('right', true);
    }
    else if (direction == 'up')
    {
        player.setVelocityY(-200);
        player.anims.play('up', true);
    } else if (direction == 'down')
    {
        player.setVelocityY(200);
        player.anims.play('down', true);
    }
}

function userStop () {
    player = users_list[socket.id];
    console.log('I will give you coords from ' + user_id)
    socket.emit('user_position', {x: player.x, y: player.y});
    player.setVelocityX(0);
    player.setVelocityY(0);
    player.anims.play('idle');
}