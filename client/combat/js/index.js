var socket = io('/combat');

socket.on('GAME_DATA', function(gameData) {
  // set the game data and spawn
  playScreen.gameDataReceived(gameData);

  // init with the current user
  GuiManager.init(
    gameData.players[socket.id]
  );
});
socket.on('NEW_PLAYER', function(player) {
  playScreen.spawn(player);
});
socket.on('TURN', function(turn) {
  playScreen.beginTurn(turn);
});
socket.on('OUTCOME', function(events) {
  playScreen.animateEvents(events);
});
$('#form').on('submit', function(event) {
  event.preventDefault();
  $(this).animate(
    {
      bottom: -100,
      opacity: 0,
    },
    500,
    function(){
      $(this).remove();
      $('.GUI').animate({
        height: '30vh',
      }, 500);
    }
  );
  
  bootScreen.instance.scene.start('playScreen');
});
