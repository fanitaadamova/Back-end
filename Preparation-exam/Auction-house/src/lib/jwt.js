const util = require('util');
const jsonwebtoken = require('jsonwebtoken');

//convert callbacks to promises with util library
const jwt = {
    sign: util.promisify(jsonwebtoken.sign),
    verify: util.promisify(jsonwebtoken.verify),
}

module.exports = jwt;