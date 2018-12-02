function Dwarf(character, { x, y }) {
  var gameInstance = playScreen.instance;
  var sprite = gameInstance.add.sprite(x, y, 'dwarf').setDisplaySize(120, 180).play('dwarf-idle');
  
  var nameTag = gameInstance.add.text(
    0, // x coordinate is set below
    sprite.y - sprite.height - 20,
    character.entity.name,
    { fontSize: '17px', fill: '#fff', backgroundColor: '#0008' }
  );
  nameTag.x = sprite.x - nameTag.width/2
  
  const state = {
    id: character.id,
    entity: character.entity,
    entityData: character.entity.entityData,
    sprite,
    nameTag,
  }

  return Object.assign(
    {},
    extensionHealth(state),
    extensionIcon(state),
    state
  )
}

Dwarf.init = function() {
  var gameInstance = playScreen.instance;

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
