const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('syncdb', 'root', 'user_password', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // or true if you want SQL logs
});

module.exports = sequelize;
