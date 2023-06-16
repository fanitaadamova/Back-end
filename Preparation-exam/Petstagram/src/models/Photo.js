const mongoose = require('mongoose');

//create Shema
//Nested colection for comments
const photoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is requered!'],
        minLength: [4, 'The name should be at least four characters.']
    },
    imageUrl: {
        type: String,
        required: [true, 'Image is requered!'],
        validate: {
            validator: (value) => /^https?:\/\//.test(value),
            message: 'The game image URL should start with "http://" or "https://"!'
        }
    },
    age: {
        type: Number,
        required: [true, 'Age is requered!'],
        validate: {
            validator: (value) => value > 0 && value < 100,
            message: 'The age is required and should be at least 1 and no longer than 100 characters!'
        }
    },
    description: {
        type: String,
        required: [true, 'Description is requered!'],
        minLength: [5, 'The description should be at least 5 characters long!'],
        maxLength: [50, 'The description should be no longer than 50 characters!'],
    },
    location: {
        type: String,
        required: [true, 'Location is requered!'],
        minLength: [5, 'The location should be at least 5 characters long!'],
        maxLength: [50, 'The location should be no longer than 50 characters!'],
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    comments: [
        {
            user: {
                type: mongoose.Types.ObjectId,
                required: true,
                ref: 'User',
            },
            message: {
                type: String,
                required: [true, 'Comment message is requered!'],
            }
        }
    ]
});


//create Model 
const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;