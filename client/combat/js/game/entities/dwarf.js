function Dwarf(gameInstance, { id, entity }, { x, y }) {
  this.id = id;

  this.sprite = gameInstance.add.sprite(x, y, 'dwarf')
    .setDisplaySize(120, 180)
    .play('dwarf-idle');

  // NAME TAG OVER THE USER
   this.nameTag = gameInstance.add.text(
    0,
    this.sprite.y - this.sprite.height - 20,
    entity.name,
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
  gameInstance.anims.create({
    key: 'dwarf-walk',
    frames: gameInstance.anims.generateFrameNumbers('dwarf', { start: 11, end: 17}),
    frameRate: 7,
    repeat: -1,
  });
  gameInstance.anims.create({
    key: 'dwarf-attack',
    frames: gameInstance.anims.generateFrameNumbers('dwarf', { start: 21, end: 27 }),
    frameRate: 8,
    repeat: 1,
  });
  gameInstance.anims.create({
    key: 'dwarf-harm',
    frames: gameInstance.anims.generateFrameNumbers('dwarf', { start: 40, end: 44 }),
    frameRate: 4,
    repeat: 1,
  });

  return Dwarf
}

entityTypes[0] = Dwarf
