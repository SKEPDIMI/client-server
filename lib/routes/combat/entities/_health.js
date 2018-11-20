module.exports = function health (options = {}) {
  let state = {
    health: options.health || 100,
    maxHealth: options.maxHealth || options.health || 100,
    dead: false,
    takeDamage(dmg) {
      state.health -= dmg;
      
      if (state.health <= 0) {
        state.health = 0
        state.dead = true
      }
    }
  }

  return state
}
