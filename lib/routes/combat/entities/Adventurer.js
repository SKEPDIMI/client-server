const player = require('./_player');
const health = require('./_health');
const Attacks = require('./_attacks');

function Adventurer({name}) {
  let state = {
    entityData: {
      id: 'entity-2',
      name: 'adventurer',
    },
    attack: 4,
    defense: 1,
    attacks: Attacks([
      'attack-0',
      'attack-1',
    ]),
    effects: [],
    health: 35,
  }

  return Object.assign(
    {},
    player(state),
    health(state),
    state,
  )
}

module.exports = Adventurer