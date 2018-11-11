module.exports = function health (state = {}) {
  return {
    health: state.health || 100,
    maxHealth: state.maxHealth || state.health || 100,
  }
}