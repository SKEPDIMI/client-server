import React, { Component } from 'react';
import GUI from './components/GUI';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
          <h1>Battle - Foggy Woods</h1>
        </header>
        <GUI />
      </div>
    );
  }
}

export default App;
