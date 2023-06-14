const bcrypt = require('bcrypt');
const jwt = require('../lib/jwt');

const User = require('../models/User');
const { SECRET } = require('../config/config');


exports.register = async (userData) => {
    const user = await User.findOne({ username: userData.username });

    if (user) {
        throw new Error('Username already exist!')
    }

    return User.create(userData);
}

exports.login = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Can not find email or password!')
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        throw new Error('Can not find email or password!')
    }

    const payload = {
        _id: user._id,
        username: user.username,
        email: user.email
    }

    const token = await jwt.sign(payload, SECRET, { expiresIn: '2d' })

    return token;
}