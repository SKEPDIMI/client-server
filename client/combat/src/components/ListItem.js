import React, { Component } from 'react'

class ListItem extends Component {
  render() {
    let { selected } = this.props;

    return(
      <li className={selected?'active':''}>
        {this.props.children}
      </li>
    )
  }
}

export default ListItem