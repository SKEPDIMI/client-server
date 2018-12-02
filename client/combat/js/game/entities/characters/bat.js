var Bat = function (character, { x, y }) {
  var gameInstance = playScreen.instance;
  var sprite = gameInstance.add.sprite(x, y, 'bat')
    .setDisplaySize(80, 80)
    .play('bat-idle');

  // NAME TAG OVER THE USER
  var nameTag = gameInstance.add.text(
    0,
    sprite.y - 80,
    character.entity.name,
    { fontSize: '17px', fill: '#fff', backgroundColor: '#0008' }
  );
  nameTag.x = sprite.x - nameTag.width/2

  var state = {
    enemy: true,
    id: character.id,
    entity: character.entity,
    entityData: character.entity.entityData,
    sprite,
    nameTag,
  }

  return Object.assign(
    {},
    extensionHealth(state),
    state,
  )
}

Bat.init = function() {
  var gameInstance = playScreen.instance;

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

entityTypes['entity-1'] = Bat
