import React, { Component } from 'react'
import ListItem from './ListItem'

const SCREENS = {
  root: {
    options: [
        { title: 'Attacks', to: 'attacks' },
        { title: 'Potions', to: 'potions' },
        { title: 'Actions', to: 'actions' }
      ]
  },
  potions: {
    options: [
      { title: 'Back', to: 'root' },
      { title: 'Heal'},
      { title: 'Thorns'},
      { title: 'Poison'},
      { title: 'Mana'}
    ]
  },
  attacks: {
    options: [
      { title: 'Back', to: 'root'},
      { title: 'Swing'},
      { title: 'Jab'},
    ]
  },
  actions: {
    options: [
      { title: 'Back', to: 'root'},
      { title: 'Run away'},
    ]
  }
}


class GUI extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentlyActive: 0,
      currentScreen: SCREENS.root,
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.navigateToOption = this.navigateToOption.bind(this);
    this.mapOptions = this.mapOptions.bind(this);
  };
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
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
        return
      // DOWN ARROW
      case 40:
        this.setState({
          currentlyActive: currentlyActive === currentScreen.options.length-1 ? 0 : currentlyActive + 1
        })
        return
      // ENTER
      case 13:
        this.navigateToOption(currentScreen, currentScreen.options[currentlyActive]);
        return
    }
  }

  navigateToOption(prev, option) {
    // if it redirects us
    if(option.to) {
      let nextScreen = SCREENS[option.to]
      
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

    let mappedOptions = [
      ...currentScreen.options.map((option, i) => {
        return (
          <ListItem key={i} selected={currentlyActive === i}>
            {option.title}
          </ListItem>
        )
      })
    ];

    return mappedOptions
  }

  render() {

    return(
      <div className="GUI">
        <div className="left">
          <h2>HP 75/100</h2>
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

export default GUI