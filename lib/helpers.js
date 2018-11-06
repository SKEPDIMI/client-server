var helpers = {}

helpers.generateUserData = function (test = false) {
  return {
    x: 50,
    y: -50,
    moving: false,
    direction: 'down',
    movementQueue: [],
    speed: 200,
  }
}

module.exports = helpers;
