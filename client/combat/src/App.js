import React, { Component } from 'react';
import GUI from './components/GUI';
import { connect } from 'react-redux';

class App extends Component {
  render() {
    let { level } = this.props;

    return (
      <div className="App">
        <header>
          <h1>Battle - {level.title}</h1>
        </header>
        <GUI />
      </div>
    );
  }
}

const d = state => ({
  level: state.currentLevel,
});

export default connect(d)(App);
