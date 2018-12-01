var socket = io('/combat');

socket.on('disconnect', function() {
  alert('You have been disconnected from the match');
  location.reload();
});
socket.on('PLAYER_DISCONNECTED', function(id) {
  playScreen.removePlayer(id);
});
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
socket.on('MATCH_END', function(endState) {
  GuiManager.setSelectionMode('HIDDEN');
  playScreen.animateEvents(endState);
});

socket.on('ERROR', function(error) {
  $('#root')
    .append('<div class="error-container">' + error + '</div>')
    .click(function() {
      $('.error-container').remove();
    });
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
