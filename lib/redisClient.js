var redis = require('redis');
var host = process.env.REDIS_HOST

var client = redis.createClient(host);

console.log('SERVER...STATUS = ', 'connecting redis client');

client.on('connect', function() {
  console.log('SERVER...STATUS = ', 'redis client connected');
});

module.exports = client
