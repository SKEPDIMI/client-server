var socket = io('/combat');

socket.on('GAME_DATA', function(game) {
  playScreen.gameData = Object.assign({}, game);
  bootScreen.instance.scene.start('playScreen');
});

$('#form').on('submit', function(event) {
  event.preventDefault();
  var name = $('#form #name-input').val();
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
  
  socket.emit('JOIN_GAME', name);
});
