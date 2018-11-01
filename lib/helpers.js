var helpers = {}

helpers.generateUserData = function (test = false) {
  return {
    x: 20,
    y: -20,
    moving: false,
    direction: 'down',
    movementQueue: [],
    speed: 200,
  }
}

module.exports = helpers;
