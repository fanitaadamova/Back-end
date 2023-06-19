const mongoose = require('mongoose');

//create Shema
const animalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is requered!'],
        minLength: [2, 'The name should be at least 2 characters.']
    },
    years: {
        type: Number,
        required: [true, 'Years is requered!'],
        validate: {
            validator: (value) => value >= 1 && value <= 100,
            message: 'The years is required and should be at least 1 and no longer than 100 characters!'
        }
    },
    kind : {
        type: String,
        required: [true, 'Kind is requered!'],
        minLength: [3, 'The kind should be at least 3 characters long!']
    },
    imageUrl: {
        type: String,
        required: [true, 'Image is requered!'],
        validate: {
            validator: (value) => /^https?:\/\//.test(value),
            message: 'The Animal image URL should start with "http://" or "https://"!'
        }
    },
    need : {
        type: String,
        required: [true, 'Need is requered!'],
        minLength: [3, 'The need should be at least 3 characters long!'],
        maxLength: [20, 'The need should be no longer than 20 characters!'],
    },
    location : {
        type: String,
        required: [true, 'Location is requered!'],
        minLength: [5, 'The location should be at least 5 characters long!'],
        maxLength: [15, 'The location should be no longer than 15 characters!'],
    },
    description: {
        type: String,
        required: [true, 'Description is requered!'],
        minLength: [5, 'The description should be at least 5 characters long!'],
        maxLength: [50, 'The description should be no longer than 50 characters!'],
    },
    donations : [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
});



//create Model 
const Animal = mongoose.model('Animal', animalSchema);

module.exports = Animal;