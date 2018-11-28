var Bat = function (gameInstance, { id, entity }, { x, y }) {
  this.enemy = true;
  this.id = id;
  this.sprite = gameInstance.add.sprite(x, y, 'bat')
    .setDisplaySize(80, 80)
    .play('bat-idle');

  // NAME TAG OVER THE USER

  this.nameTag = gameInstance.add.text(
    0,
    this.sprite.y - 80,
    entity.name,
    { fontSize: '17px', fill: '#fff', backgroundColor: '#0008' }
  );

  this.nameTag.x = this.sprite.x - this.nameTag.width/2

  return this
}

Bat.init = function(gameInstance) {
  gameInstance.anims.create({
    key: 'bat-idle',
    frames: gameInstance.anims.generateFrameNumbers('bat', { start: 48, end: 53 }),
    frameRate: 15,
    repeat: -1
  });
  gameInstance.anims.create({
    key: 'bat-harm',
    frames: gameInstance.anims.generateFrameNumbers('bat', { start: 73, end: 75 }),
    frameRate: 15,
    repeat: -1
  });

  return Bat
}

entityTypes[1] = Bat
