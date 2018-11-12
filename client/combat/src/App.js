import React, { Component } from 'react';
import GUI from './components/GUI';
import { connect } from 'react-redux';
import helpers from './helpers';

class App extends Component {
  render() {
    let { level, currentPlayer } = this.props;

    return (
      <div className="App">
        <header>
          <h1>Battle - {level.title}</h1>
        </header>
        <GUI 
          SCREENS={helpers.generateScreensFromPlayer(currentPlayer)}
        />
      </div>
    );
  }
}

const d = state => ({
  currentPlayer: state.gameReducer.currentPlayer,
  level: state.gameReducer.currentLevel,
});

export default connect(d)(App);
