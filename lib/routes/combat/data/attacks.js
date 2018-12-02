module.exports = {
  'attack-0': {
    title: 'Jab',
    description: 'Will deal the character\'s base damage over the enemy defense. Crit strike: 0.9',
    damageFormula: (character, receiver) => {
      let criticalStrike = (Math.random() + 0.9).toFixed(2)
      let damage = (character.entity.attack / receiver.entity.defense*  criticalStrike)

      let damageFormula = `${character.entity.attack} dmg. /${receiver.entity.defense} def. * ${criticalStrike} crit.`

      return { damage, criticalStrike, damageFormula }
    },
  },
  'attack-1': {
    title: 'Swing',
    description: 'Will deal 10% of the enemy\'s health as damage ignoring 10% of the enemy defense. Crit strike: 0.85',
    damageFormula: (character, receiver) => {
      let receiverHealth = receiver.entity.health;

      // 10% of the receiver's health
      let base = receiverHealth * .1
      // only 90% of the receiver's defense
      let defense = receiver.entity.defense * .9
      let criticalStrike = (Math.random() + 0.85).toFixed(2)

      // need to take the enemy health and add 90% of their defense
      const damage = base / defense * criticalStrike
      const damageFormula = `${base} dmg. /${defense} def. * ${criticalStrike} crit.`

      return { damage, criticalStrike, damageFormula }
    },
  },
  'attack-2': {
    title: 'Bite',
    description: 'Will deal 7 damage. Crit Stike: 0.8',
    damageFormula: () => {
      const criticalStrike = (Math.random() + 0.8).toFixed(2);
      const damage = 7 * criticalStrike;

      const damageFormula = `7 dmg. * ${criticalStrike} crit.`

      return { damage, criticalStrike, damageFormula }
    },
  },
}