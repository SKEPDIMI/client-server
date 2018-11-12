const player = require('./_player');
const health = require('./_health');
const Attacks = require('./_attacks');

function Dwarf({ id }) {
  let state = {
    entityData: {
      id: 0,
      name: 'dwarf',
    },
    attacks: new Attacks([
      'jab',
      'swing',
    ])
  }

  return Object.assign(
    state,
    player({ id }),
    health({ health: 50 }),
  )
}

module.exports = Dwarf
