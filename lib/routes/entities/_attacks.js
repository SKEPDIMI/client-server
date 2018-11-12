const available = {
  'jab': { id: 0, baseDamage: 10, },
  'swing': { id: 1, baseDamage: 15 },
}

const Attacks = function(chosen) {
  let attacks = {}

  for (let i = 0; i < chosen.length; i++) {
    let name = chosen[i];
    let attack = available[name]
    if (attack) attacks[name] = attack
  }

  return attacks
}

module.exports = Attacks