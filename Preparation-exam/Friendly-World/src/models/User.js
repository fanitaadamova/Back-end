const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userShema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is requered!'],
        minLength: [10, 'The email should be at least 10 characters.']
    },
    password: {
        type: String,
        required: [true, 'Password is requered!'],
        minLength: [4, 'The name should be at least 4 characters.']
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