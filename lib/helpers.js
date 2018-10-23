var helpers = {}

helpers.generateUserData = function (test = false) {
  return { x: 0, y: 0, moving: false, test }
}

module.exports = helpers;
