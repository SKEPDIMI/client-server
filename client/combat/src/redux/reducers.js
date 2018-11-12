const defaultState = {
  currentLevel: {
    title: ''
  },
  currentPlayer: {
    _loading: true,
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
        currentPlayer: {
          ...player,
          _loading: false
        },
        players: {
          ...state.players,
          [player.id]: player,
        }
      }
    default:
      return state
  }
}