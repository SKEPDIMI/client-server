var helpers = {}

helpers.generateUserData = function (test = false) {
  return {
    x: 0,
    y: 0,
    moving: false,
    direction: 'down',
    movementQueue: [],
    speed: 200,
  }
}

module.exports = helpers;
