var moveCursorSound = new Howl({ src: ['./assets/audio/cursor-move.mp3']});
var selectCursorSound = new Howl({ src: ['./assets/audio/cursor-select.mp3']});

var GuiManager = {
  hidden: true,
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
      { title: 'Attacks', to: 'attacks' },
      { title: 'Potions', to: 'potions' },
      { title: 'Actions', to: 'actions' }
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
    if (GuiManager.hidden) return;
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
    var list = $('#gui-selection-list');
    var children = list.children();
    var activeChild = $('#gui-selection-list .active');
    var nextIndex = null;
    var len = this.guiMasterObject[this.currentScreen].length

    switch(direction.toLowerCase()) {
      case 'up':
        nextIndex = this.currentCursorIndex - 1;
        if (nextIndex < 0) {
          nextIndex = len-1
        }
        activeChild.removeClass('active');
        $(children[nextIndex]).addClass('active');
        
        this.currentCursorIndex = nextIndex;
        break;
      case 'down':
        nextIndex = this.currentCursorIndex + 1;
        if (nextIndex >= len) {
          nextIndex = 0
        }
        break;
      default:
        return
    }
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

    // check if is available!

    // this is a route
    if(selectedOption.to) {
      this.transition(selectedOption.to);
    } else if (selectedOption.select) {

    }
  }
}
GuiManager.setSelectionMode = function(selectionMode) {
  if (selectionMode == 'TARGET')
  {
    playScreen.addTargetHand();
    $('.GUI').addClass('disabled');
    this.hidden = false;
    this.selectionMode = 'TARGET';
  }
  else if (selectionMode == 'ACTION')
  {
    playScreen.removeTargetHand();
    $('.GUI').removeClass('disabled');
    this.hidden = false;
    this.selectionMode = 'ACTION';
  }
  else if (selectionMode == 'HIDDEN') {
    // HIDE GUI
  }
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
  if(currentPlayer) GuiManager.generateObjectGui(currentPlayer);

  var list = $('#gui-selection-list');
  var objectGui = this.guiMasterObject;

  for(i = 0; i < objectGui[screen].length; i++) {
    var { title } = objectGui[screen][i];
    list.append(
      "<li>" + title + "</li>"
    )
  }

  $(list.children()[0])
    .addClass('active');

  this.currentScreen = screen;
  this.currentCursorIndex = 0
}

GuiManager.generateObjectGui = function({entity}) {
  var attacks = entity.attacks;
  // PARSE ATTACKS
  var parsedAttacks = [
    { title: 'Back', to: 'root' }
  ];

  _.pairs(attacks).forEach(pair => {
    var title = pair[0];
    var attackInfo = pair[1];

    parsedAttacks.push({
      title,
      select: {
        type: 'attack',
        ...attackInfo,
      },
    });
  });

  this.guiMasterObject.attacks = parsedAttacks;

  // PARSE POTIONS

  // PARSE ACTIONS
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
  var currentTargetIndex = this.currentTargetIndex;
  var currentTargetSide = this.currentTargetSide;

  var placingLine = currentTargetSide == 0 
    ? playScreen.playerPlacingLine
    : currentTargetSide == 1
      ? playScreen.enemyPlacingLine
      : null
    
  var a = Object.values(placingLine);
  
  var j = currentTargetIndex;
  if (direction == 'down') {
    j++
  } else if (direction == 'up') {
    j--
  }

  for (var i = 0; i < a.length; i++) {
    if (a[j]) {
      result = j
      break
    }

    if (!direction || direction == 'down') {
      j++
    } else if (direction == 'up') {
      j--
    }
    if (j > a.length-1) {
      j = 0;
    }
    if (j<0) {
      j = a.length-1
    }
  }

  return j
};
