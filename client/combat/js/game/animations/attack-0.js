ANIMATIONS['attack']['attack-0'] = function(event) {
  var action = event.action;
  var damage = action.outcome.damage;
  var crit = action.outcome.criticalStrike;

  var allCharacters = getAllCharacters();
  var agentId = event.character;
  var receiverId = event.receiver;

  var agent = allCharacters.find(function(c) { return c.id === agentId});
  var receiver = allCharacters.find(function(c) { return c.id === receiverId});

  if (!agent || !receiver) {
    throw new Error('Missing character or receiver when animating')
  }

  var agentSprite = agent.sprite;
  var receiverSprite = receiver.sprite;

  return new Promise(function(resolve) {
    var timeline = playScreen.instance.tweens.createTimeline();
    var initialPosition = {x: agentSprite.x, y: agentSprite.y};

    var damageText;

    timeline.add({
      targets: agentSprite,
      x: 300,
      duration: 300,
    });
    timeline.add({
      targets: agentSprite,
      x: 300,
      duration: 1000,
    });
    timeline.add({
      targets: agentSprite,
      x: initialPosition.x,
      duration: 300,
    });

    EventChain()
    .then(function() {
      agentSprite.play('dwarf-walk'); 
    })
    .wait(300)
    .then(function() {
      receiverSprite.play('bat-harm');
      agentSprite.play('dwarf-attack');
    })
    .wait(100)
    .then(function() {
      var textHeight = 18 // this should change based on the strength of the attack

      damageText = playScreen.instance.add.text(
        receiverSprite.x - receiverSprite.width - 20,
        receiverSprite.y - receiverSprite.height - 20,
        'dmg: ' + damage + ' - crit: ' + crit + '!',
        { fontSize: textHeight+'px', fill: '#fff' }
      );
    })
    .wait(900)
    .then(function() {
      agentSprite.scaleX *= -1
      agentSprite.play('dwarf-walk');
    })
    .wait(300)
    .then(function() { // walk for 300m
      agentSprite.scaleX *= -1

      receiverSprite.play('bat-idle');
      agentSprite.play('dwarf-idle'); // go back to idle
    })
    .wait(500)
    .then(function() {
      playScreen.instance.add.tween({
        targets: damageText,
        ease: 'Sine.easeInOut',
        duration: 500,
        delay: 0,
        y: damageText.y - 20,
        alpha: {
          getStart: () => 1,
          getEnd: () => 0
        },
        onComplete: function() {
          damageText.destroy();
        }
      });
    })
    .setTimeline(timeline)
    .onDone(resolve)
    .play();
  });
}
