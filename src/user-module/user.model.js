const Sequelize = require('sequelize');
const sequelize = require('../config/database');

class User extends Sequelize.Model {}
User.init(
  {
    username: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    phone_number: {
      type: Sequelize.STRING,
    },
    gender: {
      type: Sequelize.STRING,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
  }
);
module.exports = User;
