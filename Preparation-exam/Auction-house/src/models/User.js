const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is requered!'],
        unique: true,
        validate: {
            validator: (value) =>  /^[a-z]+@[a-z]+\.[a-z]+$/.test(value),
            message: 'The email should be in the following format: <name>@<domain>.<extension> and only English letters!',
        }
    },
    password: {
        type: String,
        required: [true, 'Password is requered!'],
    },
    firstName: {
        type: String,
        required: [true, 'First name is requered!'],
        minLength: [1, 'First name must be at least 1 characters long!']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is requered!'],
        minLength: [1, 'Last name must be at least 1 characters long!']

    },
});


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