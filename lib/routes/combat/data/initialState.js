module.exports = {
  turn: null, // 0 means users, 1 means enemies
  enemies: {},
  players: {},
  // stored the events taken
  // on a turn in order to be sent
  events: [],
  // stored the events applied on each turn
  turnEvents: {}
}