function Player(data, isCurrentUser = false) {
  this.speed = data.speed;
  this.moving = data.moving;
  this.direction = data.direction;
  this.movementQueue = data.movementQueue;

  this.isCurrentUser = isCurrentUser;

  this.sprite = _this.physics.add.sprite(0, 0, 'dude')
  this.sprite.setBounce(false);
  this.sprite.setCollideWorldBounds(true);

  _this.physics.add.collider(this.sprite, _this.waterLayer);
  _this.physics.add.collider(this.sprite, _this.terrainLayer);
}

Player.addAnimations = function() {
  /* MOVEMENT SPRITES */
  _this.anims.create({
    key: 'left',
    frames: _this.anims.generateFrameNumbers('dude', { start: 0, end: 7 }),
    frameRate: 10,
    repeat: -1
  });
  _this.anims.create({
    key: 'right',
    frames: _this.anims.generateFrameNumbers('dude', { start: 8, end: 15 }),
    frameRate: 10,
    repeat: -1
  });
  _this.anims.create({
    key: 'up',
    frames: _this.anims.generateFrameNumbers('dude', { start: 16, end: 23 }),
    frameRate: 10,
    repeat: -1
  });
  _this.anims.create({
    key: 'down',
    frames: _this.anims.generateFrameNumbers('dude', { start: 24, end: 31 }),
    frameRate: 10,
    repeat: -1
  });

  /* IDLE FRAMES */
  _this.anims.create({
    key: 'up_idle',
    frames: [ {key: 'dude', frame: 16} ],
    frameRate: 10,
    repeat: 1
  });
  _this.anims.create({
    key: 'left_idle',
    frames: [ {key: 'dude', frame: 1} ],
    frameRate: 10,
    repeat: 1
  });
  _this.anims.create({
    key: 'right_idle',
    frames: [ {key: 'dude', frame: 8} ],
    frameRate: 10,
    repeat: 1
  });
  _this.anims.create({
    key: 'down_idle',
    frames: [ {key: 'dude', frame: 25} ],
    frameRate: 10,
    repeat: 1
  });
}

Player.prototype.update = function(movementStack) {
  // dont update player animation every tick! only when it's different
  // also don't animate if it's the current user, we do that with keystrokes :)
  if (!this.isCurrentUser && this.moving != movementStack.moving || this.direction != movementStack.direction) {
    this.animateMovement(movementStack.moving, movementStack.direction);
  }
  
  this.sprite.x = movementStack.x;
  this.sprite.y = movementStack.y;
  this.direction = movementStack.direction;
  this.moving = movementStack.moving;
}

Player.prototype.animateMovement = function(moving, direction) {
  if (moving) {
    switch (direction) {
        case 'left':
          this.sprite.setVelocityY(0);
          this.sprite.setVelocityX(-this.speed);
          break;
        case 'right':
          this.sprite.setVelocityY(0);
          this.sprite.setVelocityX(this.speed);
          break;
        case 'up':
          this.sprite.setVelocityX(0);
          this.sprite.setVelocityY(-this.speed);
          break;
        case 'down':
          this.sprite.setVelocityX(0);
          this.sprite.setVelocityY(this.speed);
          break;
    }

    this.sprite.anims.play(direction, true);
  } else {
    this.sprite.setVelocityX(0);
    this.sprite.setVelocityY(0);
    this.sprite.anims.play(direction + '_idle');
  }
}