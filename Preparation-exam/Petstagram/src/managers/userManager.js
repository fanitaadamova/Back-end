const bcrypt = require('bcrypt');
const jwt = require('../lib/jwt');

const User = require('../models/User');
const { SECRET } = require('../config/config');


exports.register = async (userData) => {
    const user = await User.findOne({ username: userData.username });

    if (user) {
        throw new Error('Username already exist!')
    }

    const createdUser = await User.create(userData);
  
    const token = await generateToken(createdUser);

    return token
}

exports.login = async (username, password) => {
    const user = await User.findOne({ username });

    if (!user) {
        throw new Error('Can not find username or password!')
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        throw new Error('Can not find username or password!')
    }

    const token = await generateToken(user);

    return token;
}


async function generateToken(user) {
    const payload = {
        _id: user._id,
        username: user.username,
        email: user.email
    }
    const token = await jwt.sign(payload, SECRET, { expiresIn: '2d' })

    return token;

}