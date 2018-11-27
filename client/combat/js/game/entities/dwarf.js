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

  return Dwarf
}

// WILL ANIMATE THE CHARACTER SPRITE AND RESOLVE
// Note: The function to run a single, simple animation
// requires >= 32 lines. Probably would be a good idea
// to put separate animations in separate files...

Dwarf.prototype.animate = function(action) {
  var sprite = this.sprite;
  var timeline = playScreen.instance.tweens.createTimeline();
  var initialPosition = {x: sprite.x, y: sprite.y};

  return new Promise(function(resolve) {
    switch(action.type.toLowerCase()) {
      case 'attack':
        if (action.id === 'attack-0') {
          // MOVE FORWARD
          timeline.add({
            targets: sprite,
            x: 300,
            duration: 300,
          });
          // IDLE
          timeline.add({
            targets: sprite,
            x: 300,
            duration: 1000,
          });
          // MOVE BACK
          timeline.add({
            targets: sprite,
            x: initialPosition.x,
            duration: 300,
          });
          sprite.play('dwarf-walk'); 
          setTimeout(function() { // walk for 300m
            sprite.play('dwarf-attack'); 
            setTimeout(function() { // attack for 800m
              sprite.scaleX *= -1
              sprite.play('dwarf-walk');
              setTimeout(function() { // walk for 300m
                sprite.scaleX *= -1
                sprite.play('dwarf-idle'); // go back to idle
              }, 300);
            }, 1000)
          }, 300)

          timeline.onComplete = resolve
          timeline.play();
        } else {
          console.error('UNKNOWN ACTION ID WHEN ANIMATING');
          resolve();
        }
        break;
      default:
        console.error('UNKOWN ACTION.TYPE WHEN ANIMATING');
        resolve();
    }
  });
}