const player = require('./_player');
const health = require('./_health');
const Attacks = require('./_attacks');

function Dwarf({name}) {
  let state = {
    entityData: {
      id: 0,
      name: 'dwarf',
    },
    attack: 2,
    defense: 2,
    attacks: Attacks([
      'attack-0',
      'attack-1',
    ]),
    effects: [],
    health: 50,
  }

  return Object.assign(
    {},
    player(state),
    health(state),
    state,
  )
}

module.exports = Dwarf
