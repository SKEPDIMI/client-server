function Adventurer(character, { x, y }) {
  var gameInstance = playScreen.instance;
  var sprite = gameInstance.add.sprite(x, y, 'adventurer').setDisplaySize(120, 180).play('adventurer-idle');
  
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
      'idle': 'adventurer-idle',
      'movement': 'adventurer-walk',
      'attack-0': 'adventurer-jab',
      'attack-1': 'adventurer-swing',
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

Adventurer.init = function() {
  var gameInstance = playScreen.instance;

  gameInstance.anims.create({
    key: 'adventurer-idle',
    frames: gameInstance.anims.generateFrameNumbers('adventurer', { start: 0, end: 12 }),
    frameRate: 5,
    repeat: -1
  });
  gameInstance.anims.create({
    key: 'adventurer-walk',
    frames: gameInstance.anims.generateFrameNumbers('adventurer', { start: 14, end: 20 }),
    frameRate: 7,
    repeat: -1,
  });
  gameInstance.anims.create({
    key: 'adventurer-swing',
    frames: gameInstance.anims.generateFrameNumbers('adventurer', { start: 40, end: 50 }),
    frameRate: 8,
    repeat: 1,
  });
  gameInstance.anims.create({
    key: 'adventurer-jab',
    frames: gameInstance.anims.generateFrameNumbers('adventurer', { start: 54, end: 63 }),
    frameRate: 8,
    repeat: 1,
  });
  gameInstance.anims.create({
    key: 'adventurer-harm',
    frames: gameInstance.anims.generateFrameNumbers('adventurer', { start: 54, end: 63 }),
    frameRate: 8,
    repeat: 1,
  });

  return Adventurer
}

entityTypes['entity-2'] = Adventurer
