var Bat = function (gameInstance, character, { x, y }) {
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

  // HEALTH BAR
  var graphics = gameInstance.add.graphics(nameTag.x, nameTag.y);
  var healthWidth = (character.entity.health/character.entity.maxHealth) * nameTag.width;

  var healthBar = graphics
    .fillStyle(0x56F33E)
    .fillRect(nameTag.x, nameTag.y + nameTag.height, healthWidth, 2);

  var healthBarBackground = graphics
    .fillStyle(0xBEBEBE)
    .fillRect(
      nameTag.x + healthWidth,
      nameTag.y + nameTag.height,
      nameTag.width - healthWidth,
      2
    );

  var state = {
    enemy: true,
    id: character.id,
    entity: character.entity,
    entityData: character.entityData,
    sprite,
    nameTag,
    healthBar,
    healthBarBackground,
  }

  return Object.assign(
    {},
    state,
  )
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
