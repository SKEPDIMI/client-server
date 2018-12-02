var moveCursorSound = new Howl({ src: ['./assets/audio/cursor-move.mp3']});
var selectCursorSound = new Howl({ src: ['./assets/audio/cursor-select.mp3']});

var GuiManager = {
  initialized: false,
  selectionMode: null,
  // TARGET SELECTION:
  currentTargetSide: 0,
  currentTargetIndex: 0,
  // ACTION SELECTION: tracking position of cursor
  currentCursorIndex: 0,
  currentScreen: 'root',
  // adding delay between cursor movements
  cursorMoveDelta: Date.now(),
  cursorMinWait: 100,

  guiMasterObject: {
    root: [
    ],
    potions: [
    ],
    attacks: [
    ],
    actions: [
    ]
  }
}

GuiManager.init = function(currentPlayer) {
  GuiManager.updateGuiView(currentPlayer);

  document.addEventListener('keydown', function(event) {
    if (GuiManager.selectionMode == 'HIDDEN') return;
    if (Date.now() - GuiManager.cursorMoveDelta <= GuiManager.cursorMinWait) {
      return 
    }
    GuiManager.cursorMoveDelta = Date.now();

    switch(event.key) {
      case 'ArrowUp':
        GuiManager.moveCursor('up')
        break;
      case 'ArrowDown':
        GuiManager.moveCursor('down');
        break;
      case 'ArrowLeft':
        GuiManager.moveCursor('left');
        break;
      case 'ArrowRight':
        GuiManager.moveCursor('right');
        break;
      case 'Enter':
        GuiManager.selectOption();
        break;
      case 'Escape':
        GuiManager.exitSelectionMode();
        break;
    }
  });

  GuiManager.setSelectionMode('TARGET');
  GuiManager.initialized = true
}

GuiManager.moveCursor = function (direction) {
  if (GuiManager.selectionMode === 'TARGET')
  {
    var h = null;
    var side = null;

    switch(direction.toLowerCase()) {
      case 'up':
        h = 'up'
        break;
      case 'down':
        h = 'down'
        break;
      case 'left':
        side = 0
        break;
      case 'right':
        side = 1;
        break;
      default:
        return
    }

    if (h) {
      GuiManager.currentTargetIndex = GuiManager.nextTargetIndexInLine(h);
    } else if (typeof side == 'number') {
      GuiManager.currentTargetSide = side
      GuiManager.currentTargetIndex = GuiManager.nextTargetIndexInLine();
    } else {
      return
    }
    moveCursorSound.play();

    var settings = {
      index: GuiManager.currentTargetIndex,
      side: GuiManager.currentTargetSide
    }

    playScreen.moveTargetHandTo(settings);
  }
  else if (GuiManager.selectionMode === 'ACTION')
  {
    var options = GuiManager.guiMasterObject[GuiManager.currentScreen];
    var description = '';
    var currentIndex = GuiManager.currentCursorIndex;
    var nextIndex = currentIndex;
    var j = currentIndex;

    if (direction == 'up') {
      if (currentIndex > 0) {
        j--
      } else {
        j = options.length - 1
      }
    } else if (direction == 'down') {
      if (currentIndex < options.length-1) {
        j++
      } else {
        j = 0
      }
    } else {
      return
    }

    // select the next option that is not disabled in the screen
    for (var i = 0; i < options.length; i++) {
      if (!options[j].disabled) {
        nextIndex = j
        description = options[j].description || ''
        break
      }
  
      if (!direction || direction == 'down') {
        j++
      } else if (direction == 'up') {
        j--
      }
      if (j > options.length - 1) {
        j = 0;
      }
      if (j < 0) {
        j = options.length - 1
      }
    }

    $('.GUI #gui-description-container').html('<p>' + description + '</p>');

    if (nextIndex == currentIndex) {
      return
    }
    var children = $('#gui-selection-list').children();
    var activeChild = $('#gui-selection-list .active');

    moveCursorSound.play();

    activeChild.removeClass('active');
    $(children[nextIndex]).addClass('active');
    
    GuiManager.currentCursorIndex = nextIndex;
  }
}

GuiManager.selectOption = function() {
  selectCursorSound.play();

  if (GuiManager.selectionMode === 'TARGET') {
    GuiManager.setSelectionMode('ACTION');
  } else if (GuiManager.selectionMode == 'ACTION') {
    var currentScreenObj = GuiManager.guiMasterObject[GuiManager.currentScreen];
    var currentIndex = GuiManager.currentCursorIndex;
    var selectedOption = currentScreenObj[currentIndex];

    // player is probably hacking...
    if (selectedOption.disabled) return
    
    // this is a route
    if(selectedOption.to) {
      GuiManager.transition(selectedOption.to);
    } else if (selectedOption.select) {
      // remove and update index if player is removed / changed
      var placingLine = GuiManager.currentTargetSide == 0
        ? playScreen.playerPlacingLine
        : GuiManager.currentTargetSide == 1
          ? playScreen.enemyPlacingLine
          : null
      var target = placingLine[GuiManager.currentTargetIndex].character;

      if (!target) throw new Error('This target has been removed from its placing line');
      socket.emit('ACTION', {
        receiverId: target.id,
        action: selectedOption.select
      });

      GuiManager.setSelectionMode('HIDDEN');
    } else {
      console.log('UNKOWN OPTION ACTION');
    }
  }
}
GuiManager.setSelectionMode = function(selectionMode) {
  if (selectionMode == 'HIDDEN') {
    GuiManager.selectionMode = 'HIDDEN'
    $('.GUI').addClass('hidden');

    return GuiManager
  }

  if (selectionMode == 'TARGET')
  {
    playScreen.addTargetHand();

    $('.GUI').addClass('disabled').removeClass('hidden');
    GuiManager.selectionMode = 'TARGET';
  }
  else if (selectionMode == 'ACTION')
  {
    playScreen.removeTargetHand();
    GuiManager.transition('root');

    $('.GUI').removeClass('disabled').removeClass('hidden');
    GuiManager.selectionMode = 'ACTION';
  }

  $('.GUI').animate({
    height: '30vh',
  })
}

GuiManager.transition = function(screenName) {
  var selectedElement = $('#gui-selection-list .active')
  var list = $('#gui-selection-list');
  var children = list.children();

  selectedElement.removeClass('active');

  list.removeClass('active');
  chainRemovalAnimation(children, function() {
    GuiManager.updateGuiView(null, screenName);
  });
}

GuiManager.updateGuiView = function (currentPlayer, screen = 'root') {
  GuiManager.generateObjectGui(currentPlayer);

  var list = $('#gui-selection-list');
  var objectGui = GuiManager.guiMasterObject;

  for(i = 0; i < objectGui[screen].length; i++) {
    var { title, disabled } = objectGui[screen][i];
    var className = disabled ? 'disabled' : ''
    list.append(
      "<li class='" + className + "'>" + title + "</li>"
    )
  }

  $(list.children()[0])
    .addClass('active');

  GuiManager.currentScreen = screen;
  GuiManager.currentCursorIndex = 0
}

GuiManager.generateObjectGui = function(currentPlayer) {
  var selectedTargetCharacter = GuiManager.currentTargetSide == 0
    ? playScreen.playerPlacingLine[GuiManager.currentTargetIndex]
    : GuiManager.currentTargetSide == 1
      ? playScreen.enemyPlacingLine[GuiManager.currentTargetIndex]
      : null

  if (!selectedTargetCharacter) {
    throw new Error('unknown selected target!')
  }

  // PARSE ROOT
  var parsedRoot = [
    { title: 'Attacks', to: 'attacks', disabled: true },
    { title: 'Potions', to: 'potions', disabled: true },
    { title: 'Actions', to: 'actions', disabled: true }
  ]
  // enable options based on external conditions
  if (selectedTargetCharacter.character.enemy) {
    delete parsedRoot[0].disabled
  }
  // push them to the guiMasterObject
  GuiManager.guiMasterObject.root = parsedRoot

  if (currentPlayer) {
    // PARSE ATTACKS
    var attacks = currentPlayer.entity.attacks;
    var parsedAttacks = [
      { title: 'Back', to: 'root', disabled: false }
    ];

    _.pairs(attacks).forEach(pair => {
      var id = pair[0];
      var attackInfo = pair[1];

      parsedAttacks.push({
        title: attackInfo.title,
        description: attackInfo.description,
        select: {
          type: 'attack',
          id,
        },
      });
    });

    GuiManager.guiMasterObject.attacks = parsedAttacks;
    // PARSE POTIONS

    // PARSE ACTIONS
  }
}

GuiManager.exitSelectionMode = function() {
  if (GuiManager.selectionMode == 'ACTION') {
    selectCursorSound.play();
    GuiManager.setSelectionMode('TARGET');
  }
}

var chainRemovalAnimation = function(toAnimate, cb, ix = 0){
  var current = toAnimate[ix];
  if(current){
    $(current).animate({'opacity': 0}, 130, function(){
      chainRemovalAnimation(toAnimate, cb, ix + 1 )
    });
  } else {
    $(toAnimate).remove();
  }
  
  if(!current && cb) {
    cb();
  }
};

GuiManager.nextTargetIndexInLine = function(direction) {
  var currentTargetSide = GuiManager.currentTargetSide;
  var j = GuiManager.currentTargetIndex;
  var placingLine = currentTargetSide == 0 
    ? playScreen.playerPlacingLine
    : currentTargetSide == 1
      ? playScreen.enemyPlacingLine
      : null
    
  var a = Object.values(placingLine);
  for (var i = 0; i < a.length; i++) {
    if (!direction || direction == 'down') {
      j = a[j].next
    } else if (direction == 'up') {
      j = a[j].prev
    }
    if (a[j].character) {
      result = j
      break
    }

    
  }

  return j
};

GuiManager.setHP = function(currentUser) {
  var h = currentUser.entity.health;
  var m = currentUser.entity.maxHealth;
  var p = h/m;

  $('.health').html('HP \n' + h + ' / ' + m);
  $('#health-bar').animate({ width: (p*100)+'%'}, 500);
}