ANIMATIONS['attack']['attack-0'] = function(event) {
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

  var timeline = playScreen.instance.tweens.createTimeline();
  var initialPosition = {x: agentSprite.x, y: agentSprite.y};

  return new Promise(function(resolve) {
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

    // ok... change the play names, not all entities will have the same!
    agentSprite.play('dwarf-walk'); 
    setTimeout(function() { // walk for 300m
      receiverSprite.play('bat-harm');
      agentSprite.play('dwarf-attack'); 
      setTimeout(function() { // attack for 800m
        agentSprite.scaleX *= -1
        agentSprite.play('dwarf-walk');
        setTimeout(function() { // walk for 300m
          agentSprite.scaleX *= -1

          receiverSprite.play('bat-idle');
          agentSprite.play('dwarf-idle'); // go back to idle
        }, 300);
      }, 1000)
    }, 300)

    timeline.onComplete = resolve
    timeline.play();
  });
}