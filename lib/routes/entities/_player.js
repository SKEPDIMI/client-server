module.exports = function player (state = {}) {
  return {
    name: state.name || 'anon',
    level: state.level || 1,
  }
}