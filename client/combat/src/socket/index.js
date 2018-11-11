import io from 'socket.io-client';
import {getCurrentUser} from '../redux/actions';

const socket = io('http://localhost:5000/combat');

export default (store) => {
  socket.on('data', ({ players, level }) => {
    store.dispatch(getCurrentUser(socket.id, players));
    store.dispatch({
      type: 'SET_CURRENT_LEVEL',
      payload: level,
    });
  })
}
