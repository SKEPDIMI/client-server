const health = require('./_health');
const Attacks = require('./_attacks');

function Bat() {
  let state = {
    name: 'Forest bat',
    entityData: {
      id: 'entity-1',
      name: 'Bat',
      enemy: true,
    },
    attack: 1,
    defense: 2,
    attacks: Attacks([
      'attack-2',
    ]),
    effects: [],
    health: 50,
  }

  return Object.assign(
    {},
    health(state),
    state,
  )
}

module.exports = Bat
