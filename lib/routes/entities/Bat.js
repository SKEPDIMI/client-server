const health = require('./_health');
const Attacks = require('./_attacks');

function Bat() {
  let state = {
    entity: {
      id: 1,
      name: 'Bat',
    },
    name: 'Forest bat',
    enemy: true,
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
