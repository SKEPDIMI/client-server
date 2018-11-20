module.exports = {
  'attack-0': {
    title: 'Jab',
    baseDamage: 10,
    criticalStrike:()=>Math.random() + 0.9
  },
  'attack-1': {
    title: 'Swing',
    baseDamage: 15,
    criticalStrike:()=>Math.random() + 0.85
  },
  'attack-2': {
    title: 'Bite',
    baseDamage: 7,
    criticalStrike:()=>Math.random() + 0.80
  },
}