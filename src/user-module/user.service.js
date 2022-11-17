const User = require('./user.model');
const bcrypt = require('bcrypt');

async function save(data) {
  try {
    const hashedPass = await bcrypt.hash(data.password, Math.random());
    const userData = { ...data, password: hashedPass };
    return await User.create(userData);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = { save };
