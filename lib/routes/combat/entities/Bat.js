const health = require('./_health');
const Attacks = require('./_attacks');

function Bat() {
  let state = {
    entityData: {
      id: 1,
      name: 'Bat',
      enemy: true,
      attack: 1,
      defense: 2,
    },
    name: 'Forest bat',
    attacks: new Attacks([
      'attack-2',
    ])
  }

  return Object.assign(
    state,
    health({ health: 25 })
  )
}

module.exports = Bat
