const bcrypt = require('bcrypt');
const redisClient = require('../redisClient');
const helpers = require('../helpers');

module.exports = app => {
  console.log('SERVER...STATUS = ', 'initiating authentication routes');

  app.post('/players/new', (req, res) => {
    let username = typeof req.body.username == 'string' && req.body.username.trim().length > 3 ? req.body.username.trim() : false
    let password = typeof req.body.password == 'string' && req.body.password.trim().length > 5 ? req.body.password.trim() : false

    if (!username || !password) {
      return res.status(422).json({ message: 'username must be at least 4 characters long. password must be at least 6 characters long' });
    }

    helpers.hashPassword(password)
    .then(hashPassword => {
      var playerData = { username, hashPassword, }

      // set in database
      
      res.sendStatus(204);
    })
    .catch(err => {
      res.status(400).json({ message: err });
    })
  });
}