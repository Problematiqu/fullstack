const User = require('../models/user')
const bcrypt = require('bcrypt')

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  usersInDb,
}