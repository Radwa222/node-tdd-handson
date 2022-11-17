const { Sequelize } = require('sequelize');
const config = require('config');
const dbConfig = config.get('database');

const sequelize = new Sequelize(
  dbConfig.name,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    storage: dbConfig.storage,
  }
);

module.exports = sequelize;
