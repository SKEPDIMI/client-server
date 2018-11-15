var moveCursorSound = new Howl({ src: ['./assets/audio/cursor-move.mp3']});
var selectCursorSound = new Howl({ src: ['./assets/audio/cursor-select.mp3']});

var GuiManager = {
  enabled: false,
  // tracking position of cursor
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
  this.enabled = true;
  this.updateGuiView(currentPlayer);

  document.addEventListener('keydown', function(event) {
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
      case 'Enter':
        GuiManager.selectOption();
        break;
    }
  })
}

GuiManager.moveCursor = function (direction) {
  moveCursorSound.play();

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

  activeChild.removeClass('active');
  $(children[nextIndex]).addClass('active');
  
  this.currentCursorIndex = nextIndex;
}

GuiManager.selectOption = function() {
  selectCursorSound.play();

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
    let { title } = objectGui[screen][i];
    list.append(
      "<li>" + title + "</li>"
    )
  }

  $(list.children()[0])
    .addClass('active');

  this.currentScreen = screen;
  this.currentCursorIndex = 0
}

GuiManager.generateObjectGui = function({ attacks }) {
  // PARSE ATTACKS
  let parsedAttacks = [
    { title: 'Back', to: 'root' }
  ];

  _.pairs(attacks).forEach(pair => {
    let title = pair[0];
    let attackInfo = pair[1];

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