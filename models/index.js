const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config.json')['development'];  // Read the config for development env

// Initialize Sequelize with the correct config
const sequelize = new Sequelize(config.database, config.username, config.password, {
  dialect: config.dialect,
  storage: config.storage  // ':memory:' for in-memory database
});

// Import models
const HeartRate = require('./heartRate')(sequelize, DataTypes);

// Syncing models
sequelize.sync({ force: true }).then(() => {
  console.log('Database synced with in-memory SQLite');
});

module.exports = { sequelize, HeartRate };
