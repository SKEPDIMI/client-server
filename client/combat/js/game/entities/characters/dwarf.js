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
    animationKey: {
      'idle': 'dwarf-idle',
      'movement': 'dwarf-walk',
      'attack-0': 'dwarf-jab',
      'attack-1': 'dwarf-swing',
    }
  }

  return Object.assign(
    {},
    extensionHealth(state),
    extensionAnimationKey(state),
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
    frames: gameInstance.anims.generateFrameNumbers('dwarf', { start: 9, end: 16}),
    frameRate: 7,
    repeat: -1,
  });
  gameInstance.anims.create({
    key: 'dwarf-jab',
    frames: gameInstance.anims.generateFrameNumbers('dwarf', { start: 17, end: 23 }),
    frameRate: 8,
    repeat: 1,
  });
  gameInstance.anims.create({
    key: 'dwarf-swing',
    frames: gameInstance.anims.generateFrameNumbers('dwarf', { start: 25, end: 30 }),
    frameRate: 8,
    repeat: 1,
  });
  gameInstance.anims.create({
    key: 'dwarf-harm',
    frames: gameInstance.anims.generateFrameNumbers('dwarf', { start: 49, end: 52 }),
    frameRate: 4,
    repeat: 1,
  });

  return Dwarf
}

entityTypes['entity-0'] = Dwarf
