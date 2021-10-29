const jwt = require('jsonwebtoken')
const User = require('../models/user')

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    request.user = null
  } else {
    request.user = await User.findById(decodedToken.id)
  }

  next()
}

module.exports = userExtractor