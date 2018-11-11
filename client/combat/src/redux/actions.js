export const getCurrentUser = (id, players) => {
  var currentPlayer = players[id];
  
  return {
    type: 'SET_CURRENT_PLAYER',
    payload: currentPlayer,
  }
}