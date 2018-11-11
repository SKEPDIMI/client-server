const defaultState = {
  currentLevel: {
    title: ''
  },
  currentPlayer: {

  },
  players: {

  },
}

export default (state = defaultState, action) => {
  switch(action.type) {
    case 'SET_CURRENT_LEVEL':
      return {
        ...state,
        currentLevel: action.payload
      }
    case 'SET_CURRENT_PLAYER':
      let player = action.payload;

      return {
        ...state,
        currentPlayer: player,
        players: {
          ...state.players,
          [player.id]: player,
        }
      }
    default:
      return state
  }
}