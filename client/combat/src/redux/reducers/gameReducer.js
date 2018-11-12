const defaultState = {
  currentLevel: {
    title: ''
  },
  currentPlayer: {
    _loading: true,
  },
  players: {

  },
  enemies: {

  }
}

export default (state = defaultState, action) => {
  switch(action.type) {
    case 'SET_CURRENT_LEVEL':
      return {
        ...state,
        currentLevel: action.payload
      }
    case 'SET_CURRENT_PLAYER':
      let {id, player} = action.payload;

      return {
        ...state,
        currentPlayer: {
          ...player,
          _loading: false
        },
        players: {
          ...state.players,
          [id]: player,
        }
      }
    case 'SET_ENEMIES':
      return {
        ...state,
        enemies: {
          ...state.enemies,
          ...action.payload
        }
      }
    case 'SET_TURN_TARGET':
      return {
        ...state,
        currentTarget: true,
      }
    default:
      return state
  }
}