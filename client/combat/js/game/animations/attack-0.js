/*
  ANIMATION: JAB
*/

ANIMATIONS['attack']['attack-0'] = function(event) {
  var action = event.action;
  var {
    damageFormula
  } = action.outcome;

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

    var pos1 = agentSprite.x + 300;

    var damageText;

    var idleAnimationKey = agent.getAnimationKey('idle')
    var movementAnimationKey = agent.getAnimationKey('movement')
    var attackAnimationKey = agent.getAnimationKey('attack-1')

    timeline.add({
      targets: [agentSprite, agent.nameTag],
      x: pos1,
      duration: 300,
    });
    timeline.add({
      targets: [agentSprite, agent.nameTag],
      x: pos1,
      duration: 1000,
    });
    timeline.add({
      targets: [agentSprite, agent.nameTag],
      x: initialPosition.x,
      duration: 300,
    });

    EventChain()
    .then(function() {
      agentSprite.play(movementAnimationKey); 
    })
    .wait(300)
    .then(function() {
      receiverSprite.play('bat-harm');
      agentSprite.play(attackAnimationKey);
    })
    .wait(100)
    .then(function() {
      var textHeight = 18 // this should change based on the strength of the attack

      damageText = playScreen.instance.add.text(
        receiverSprite.x - receiverSprite.width - 20,
        receiverSprite.y - receiverSprite.height - 20,
        damageFormula,
        { fontSize: textHeight+'px', fill: '#fff' }
      );

      receiver.updateHealthBar();
    })
    .wait(900)
    .then(function() {
      agentSprite.scaleX *= -1
      agentSprite.play(movementAnimationKey);
    })
    .wait(300)
    .then(function() { // walk for 300m
      agentSprite.scaleX *= -1

      receiverSprite.play('bat-idle');
      agentSprite.play(idleAnimationKey); // go back to idle
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
