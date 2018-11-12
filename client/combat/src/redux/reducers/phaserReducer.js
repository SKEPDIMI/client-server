/**
 * USED TO STORE SPRITES,
 *               IMAGES
 * and all that good stuff
 * to be easily found and
 * manipulated
 */

const defaultState = {
  currentPlayerEntity: {},
  enemyEntities: {},
  playerEntities: {},
  selectTargetHand: {},
}

export default (state = defaultState, action) => {
  if (action.type == 'SPAWN_PLAYER_SPRITE') {
    let {id, entity} = action.payload
    return {
      ...state,
      playerEntities: {
        ...state.playerEntities,
        [id]: entity,
      }
    }
  }
  if (action.type == 'SPAWN_ENEMY_SPRITE') {
    let {id, entity} = action.payload
    
    return {
      ...state,
      enemyEntities: {
        ...state.enemyEntities,
        [id]: entity,
      }
    }
  }

  return state
}