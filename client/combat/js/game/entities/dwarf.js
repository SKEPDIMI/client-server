function Dwarf(gameInstance, {name, entityData}, { x, y }) {
  this.entityData = entityData;
  this.sprite = gameInstance.add.sprite(x, y, 'dwarf')
    .setDisplaySize(120, 180)
    .play('dwarf-idle');

  // NAME TAG OVER THE USER
   this.nameTag = gameInstance.add.text(
    0,
    this.sprite.y - this.sprite.height - 20,
    name,
    { fontSize: '17px', fill: '#fff', backgroundColor: '#0008' }
  );

  this.nameTag.x = this.sprite.x - this.nameTag.width/2

  return this
}

Dwarf.init = function(gameInstance) {
  gameInstance.anims.create({
    key: 'dwarf-idle',
    frames: gameInstance.anims.generateFrameNumbers('dwarf', { start: 0, end: 4 }),
    frameRate: 5,
    repeat: -1
  });

  return Dwarf
}