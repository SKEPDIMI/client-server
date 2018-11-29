const player = require('./_player');
const health = require('./_health');
const Attacks = require('./_attacks');

function Dwarf({name}) {
  let state = {
    entityData: {
      id: 0,
      name: 'dwarf',
      attack: 2,
      defense: 2,
    },
    attacks: new Attacks([
      'attack-0',
      'attack-1',
    ]),
  }

  return Object.assign(
    state,
    player({ name }),
    health({ health: 50 }),
  )
}

module.exports = Dwarf
