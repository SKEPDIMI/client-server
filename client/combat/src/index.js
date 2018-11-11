import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { Provider } from 'react-redux';
import store from './redux';

import socketInit from './socket'
import gameInit from './game'

socketInit(store);
gameInit(store);

// BIND TO CONTROLLER
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

