const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../sequelize'); // connection instance

const LocalData = sequelize.define('LocalData', {
  id: { type: DataTypes.STRING, primaryKey: true },
  data: { type: DataTypes.JSON },
  lastModified: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
}, {
  tableName: 'local_data',
  timestamps: false,
});

const CloudData = sequelize.define('CloudData', {
  id: { type: DataTypes.STRING, primaryKey: true },
  data: { type: DataTypes.JSON },
  lastModified: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
}, {
  tableName: 'cloud_data',
  timestamps: false,
});

module.exports = { LocalData, CloudData };
