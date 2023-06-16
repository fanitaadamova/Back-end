const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userShema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is requered!'],
        minLength: [2, 'Username is too short, should be at least 2 characters long!'],
        unique: {
            value: true,
            message: 'Username already exists',
        },
    },
    email: {
        type: String,
        required: [true, 'Email is requered!'],
        minLength: [10, 'Email is too short, should be at least 10 characters long!'],
    },
    password: {
        type: String,
        required: [true, 'Password is requered!'],
        minLength: [4, 'Username is too short, should be at least 4 characters long!'],
    }
})

userShema.virtual('repeatPassword')
    .set(function (value) {
        if (value !== this.password) {
            throw new Error('Password missmatch')
        }

    })

userShema.pre('save', async function () {
    const hash = await bcrypt.hash(this.password, 10);

    this.password = hash;
});

const User = mongoose.model('User', userShema);

module.exports = User;