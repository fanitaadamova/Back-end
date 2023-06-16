const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is requered!'],
        minLength: [4, 'The username should be at least four characters.'],
        unique: {
            value: true,
            message: 'Username already exists',
        },
    },
    email: {
        type: String,
        required: [true, 'Email is requered!'],
        minLength: [10, 'The email should be at least 10 characters.']
    },
    password: {
        type: String,
        required: [true, 'Password is requered!'],
        minLength: [3, 'The name should be at least 3 characters.']
    }
})


userSchema.virtual('repeatPassword')
    .set(function (value) {
        if (value !== this.password) {
            throw new Error('Password missmatch')
        }

    })

userSchema.pre('save', async function () {
    const hash = await bcrypt.hash(this.password, 10);

    this.password = hash;
});

const User = mongoose.model('User', userSchema);

module.exports = User;