function Bat(gameInstance, {name, entityData}, { x, y }) {
  this.entityData = entityData;
  this.sprite = gameInstance.add.sprite(x, y, 'bat')
    .setDisplaySize(80, 80)
    .play('bat-idle');

  // NAME TAG OVER THE USER

  this.nameTag = gameInstance.add.text(
    0,
    this.sprite.y - 80,
    name,
    { fontSize: '17px', fill: '#fff', backgroundColor: '#0008' }
  );

  this.nameTag.x = this.sprite.x - this.nameTag.width/2

  return this
}

Bat.initalizer = function(gameInstance) {
  gameInstance.anims.create({
    key: 'bat-idle',
    frames: gameInstance.anims.generateFrameNumbers('bat', { start: 48, end: 53 }),
    frameRate: 15,
    repeat: -1
  });

  return Bat
}

export default Bat.initalizer
