import { combineReducers } from 'redux';

import phaserReducer from './phaserReducer';
import gameReducer from './gameReducer';

export default combineReducers({
  phaserReducer,
  gameReducer,
})