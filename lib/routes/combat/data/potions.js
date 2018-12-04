module.exports = {
  'potion-1': {
    title: 'Heal I',
    duration: 2,
    description: 'Will heal the player by 5%. Duration: 2 turns',
    effect: (agent) => {
      let { entity } = agent

      let health = entity.health * .5
      entity.takeHealth(health);
      
      let updatedEntity = {
        ...entity,
        health: updatedHealth,
        effects: [...entity.effects, { id: 'potion-1', usedFor: 0 }]
      }

      let outcome = {
        potion: 'potion-1',
        updatedHealth,
      }

      return { updatedEntity, outcome }
    }
  },
  'potion-2': {
    title: 'Thorns I',
    description: 'Enemies will suffer 50% of the damage they inflict on you. Duration: 1 turn',
    duration: 1,
    effect: (agent) => {
      let { entity } = agent;

      let updatedEntity = {
        ...entity,
        effects: [...entity.effects, { id: 'potion-2', usedFor: 0 }]
      }

      return { updatedEntity }
    }
  }
}