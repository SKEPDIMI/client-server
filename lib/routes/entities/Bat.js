const health = require('./_health');
const Attacks = require('./_attacks');

function Bat() {
  let state = {
    entityData: {
      id: 1,
      name: 'Bat',
      enemy: true,
    },
    name: 'Forest bat',
    attacks: new Attacks([
      'bite',
    ])
  }

  return Object.assign(
    state,
    health({ health: 25 })
  )
}

module.exports = Bat
