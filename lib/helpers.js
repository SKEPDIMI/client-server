const bcrypt = require('bcrypt');
const salt = process.env.BCRYPT_SALT

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

helpers.getAuthenticatedUser = (username, password) => {
  return new Promise(function(resolve, reject) {
    if (!username || !password) 
      return reject('Missing username or password')

    redisClient.get(username, (err, val) => {
      if (err || !val)
        return reject('Failed to find user by this username')

      let player = JSON.parse(val);

      bcrypt.compare(password, player.hash, function(err, res) {
        if (err || !res) {
          reject('Failed authentication');
        } else {
          resolve(player);
        }
      });        
    });
  });
}

helpers.hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    if (typeof password != 'string') return reject('Password must be a string');

    bcrypt.hash(password, salt, (err, enc) => {
      if (err || !enc) {
        reject('Could not hash password');
      } else {
        resolve(enc);
      }
    });
  });
}

module.exports = helpers;
