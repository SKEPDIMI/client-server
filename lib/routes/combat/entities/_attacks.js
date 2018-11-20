const available = require('../data/attacks');

const Attacks = function(chosen) {
  let attacks = {}

  for (let i = 0; i < chosen.length; i++) {
    let id = chosen[i];
    let attack = available[id]
    if (attack) attacks[id] = attack
  }

  return attacks
}

module.exports = Attacks