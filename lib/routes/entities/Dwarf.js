const player = require('./_player');
const health = require('./_health');

function Dwarf({ id }) {
  let state = {
    entity: {
      id: 0,
      name: 'dwarf',
    }
  }

  return Object.assign(
    state,
    player({ id }),
    health({ health: 50 }),
  )
}

module.exports = Dwarf
