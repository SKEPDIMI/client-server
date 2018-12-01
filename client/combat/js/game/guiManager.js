var moveCursorSound = new Howl({ src: ['./assets/audio/cursor-move.mp3']});
var selectCursorSound = new Howl({ src: ['./assets/audio/cursor-select.mp3']});

var GuiManager = {
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
  this.updateGuiView(currentPlayer);

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
  })
}

GuiManager.moveCursor = function (direction) {
  if (this.selectionMode === 'TARGET')
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
      this.currentTargetIndex = GuiManager.nextTargetIndexInLine(h);
    } else if (typeof side == 'number') {
      this.currentTargetSide = side
      this.currentTargetIndex = GuiManager.nextTargetIndexInLine();
    } else {
      return
    }
    moveCursorSound.play();

    var settings = {
      index: this.currentTargetIndex,
      side: this.currentTargetSide
    }

    playScreen.moveTargetHandTo(settings);
  }
  else if (this.selectionMode === 'ACTION')
  {
    var options = this.guiMasterObject[this.currentScreen]
    var currentIndex = this.currentCursorIndex;
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

    if (nextIndex == currentIndex) {
      return
    }
    var children = $('#gui-selection-list').children();
    var activeChild = $('#gui-selection-list .active');

    moveCursorSound.play();

    activeChild.removeClass('active');
    $(children[nextIndex]).addClass('active');
    
    this.currentCursorIndex = nextIndex;
  }
}

GuiManager.selectOption = function() {
  selectCursorSound.play();

  if (this.selectionMode === 'TARGET') {
    this.setSelectionMode('ACTION');
  } else if (this.selectionMode == 'ACTION') {
    var currentScreenObj = this.guiMasterObject[this.currentScreen];
    var currentIndex = this.currentCursorIndex;
    var selectedOption = currentScreenObj[currentIndex];

    // player is probably hacking...
    if (selectedOption.disabled) return
    
    // this is a route
    if(selectedOption.to) {
      this.transition(selectedOption.to);
    } else if (selectedOption.select) {
      // remove and update index if player is removed / changed
      var placingLine = this.currentTargetSide == 0
        ? playScreen.playerPlacingLine
        : this.currentTargetSide == 1
          ? playScreen.enemyPlacingLine
          : null
      var target = placingLine[this.currentTargetIndex].character;

      if (!target) throw new Error('This target has been removed from its placing line');

      socket.emit('ACTION', {
        target: { id: target.id},
        action: selectedOption.select
      });

      this.setSelectionMode('HIDDEN');
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
    this.selectionMode = 'TARGET';
  }
  else if (selectionMode == 'ACTION')
  {
    playScreen.removeTargetHand();
    this.transition('root');

    $('.GUI').removeClass('disabled').removeClass('hidden');
    this.selectionMode = 'ACTION';
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
  var objectGui = this.guiMasterObject;

  for(i = 0; i < objectGui[screen].length; i++) {
    var { title, disabled } = objectGui[screen][i];
    console.log(title + ' is ' + disabled ? '' : 'not ' + 'disabled')
    var className = disabled ? 'disabled' : ''
    list.append(
      "<li class='" + className + "'>" + title + "</li>"
    )
  }

  $(list.children()[0])
    .addClass('active');

  this.currentScreen = screen;
  this.currentCursorIndex = 0
}

GuiManager.generateObjectGui = function(currentPlayer) {
  var selectedTargetCharacter = this.currentTargetSide == 0
    ? playScreen.playerPlacingLine[this.currentTargetIndex]
    : this.currentTargetSide == 1
      ? playScreen.enemyPlacingLine[this.currentTargetIndex]
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
  this.guiMasterObject.root = parsedRoot

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
        select: {
          type: 'attack',
          id,
        },
      });
    });

    this.guiMasterObject.attacks = parsedAttacks;
    // PARSE POTIONS

    // PARSE ACTIONS
  }
}

GuiManager.exitSelectionMode = function() {
  if (this.selectionMode == 'ACTION') {
    selectCursorSound.play();
    this.setSelectionMode('TARGET');
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

// FIND THE INDEX OF THE NEXT TARGET IN
// THE GAME'S PLACING LINE DEPENDING ON
// THE DIRECTION AND SIDE
// example:
/*
  playScreen.playerPlacingLine = {
    0: {name: 'john'},
    1: {name: 'doe'},
    2: {name: 'bob'},
    3: null,
  }
  this.currentTargetIndex = 1;
  this.currentTargetSide = 0; // this means playerPlacingLine

  GuiManager.nextTargetIndexInLine('up'); // => 2
  GuiManager.nextTargetIndexInLine('down'); // 0

  this.currentTargetIndex = 0;
  GuiManager.nextTargetIndexInLine('up'); // => 1
  GuiManager.nextTargetIndexInLine('down'); // => 2
*/

GuiManager.nextTargetIndexInLine = function(direction) {
  var currentTargetSide = this.currentTargetSide;
  var j = this.currentTargetIndex;
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
