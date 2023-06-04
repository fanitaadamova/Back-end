const util = require('util');
const jwt = require('jsonwebtoken');

//convert callbacks to promises with util library
const jwtPromises = {
    sign: util.promisify(jwt.sign),
    verify: util.promisify(jwt.verify),
}

module.exports = jwtPromises;