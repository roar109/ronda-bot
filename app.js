const config = require('./lib/configuration').config;
const UserDelegate = require('./lib/users').UserDelegate;

console.log(config.botName);
console.log(UserDelegate.getUsersFromChannel('url','id'));
