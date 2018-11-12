import React, { Component } from 'react'
import { Howl } from 'howler';
import ListItem from './ListItem'
import { connect } from 'react-redux';

var cursorMove = new Howl({
  src: [require('../assets/audio/cursor-move.mp3')]
});
var cursorSelect = new Howl({
  src: [require('../assets/audio/cursor-select.mp3')]
});


class GUI extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentlyActive: 0,
      currentScreen: null,
      screens: null
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.navigateToOption = this.navigateToOption.bind(this);
    this.mapOptions = this.mapOptions.bind(this);
  };
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }
  componentDidUpdate(prevProps) {
    let {
      SCREENS,
    } = this.props;

    // if we havent set the screen AND we have valid SCREENS
    if (!this.state.currentScreen && SCREENS) {
      console.log('set root');
      this.setState({
        currentScreen: SCREENS.root,
        currentlyActive: 0,
      });
    }
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  handleKeyPress(event) {
    let { currentlyActive, currentScreen } = this.state;

    switch(event.keyCode) {
      // UP ARROW
      case 38:
        this.setState({
          currentlyActive: currentlyActive === 0 ? currentScreen.options.length-1 : currentlyActive - 1
        });
        cursorMove.play()
        return
      // DOWN ARROW
      case 40:
        this.setState({
          currentlyActive: currentlyActive === currentScreen.options.length-1 ? 0 : currentlyActive + 1
        })
        cursorMove.play()
        return
      // ENTER
      case 13:
        this.navigateToOption(currentScreen.options[currentlyActive]);
        cursorSelect.play()
        return
    }
  }

  navigateToOption(option) {
    // if it redirects us
    if(option.to) {
      let nextScreen = this.props.SCREENS[option.to]
      
      if(!nextScreen) {
        console.log(option.to + ' is not a valid screen.')
      } else {
        this.setState({
          currentlyActive: 0,
          currentScreen: {
            ...nextScreen,
          },
        });
      }
    } else {
      console.log('no redirection')
    }
  }
  mapOptions() {
    let { currentlyActive, currentScreen } = this.state;
    if (!currentScreen) return null

    return currentScreen.options.map((option, i) => (
      <ListItem key={i} selected={currentlyActive === i}>
        {option.title}
      </ListItem>)
    );
  }

  render() {
    let {
      currentPlayer
    } = this.props

    return(
      <div className="GUI">
        <div className="left">
          <h2>HP {currentPlayer.health}/{currentPlayer.maxHealth}</h2>
        </div>
        <div className="center">
          <ul>
            {
              this.mapOptions()
            }
          </ul>
        </div>
        <div className="right">
        
        </div>
      </div>
    )
  }
}

const d = state => ({
  currentPlayer: state.currentPlayer
});

export default connect(d)(GUI)
