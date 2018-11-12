export const getCurrentUser = (id, players) => {
  var currentPlayer = players[id];
  
  return {
    type: 'SET_CURRENT_PLAYER',
    payload: {id, player: currentPlayer},
  }
}

export const getEntityType = (id, entity) => {
  if (entity.entityData.enemy) {
    return {
      type: 'SPAWN_ENEMY_SPRITE',
      payload: {id, entity},
    }
  } else {
    return {
      type: 'SPAWN_PLAYER_SPRITE',
      payload: {id, entity},
    }
  }
}