const mongoose = require('mongoose');

//create Shema
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is requered!'],
        minLength: [2, 'The title should be at least 2 characters.']
    },
    author: {
        type: String,
        required: [true, 'Author is requered!'],
        minLength: [5, 'The author should be at least 5 characters.']
    },
    imageUrl: {
        type: String,
        required: [true, 'Image is requered!'],
        validate: {
            validator: (value) => /^https?:\/\//.test(value),
            message: 'The game image URL should start with "http://" or "https://"!'
        }
    },
    review: {
        type: String,
        required: [true, 'Review is requered!'],
        minLength: [10, 'The review should be at least 10 characters long!']
    },
    genre: {
        type: String,
        required: [true, 'Genre is requered!'],
        minLength: [3, 'The Genre should be at least 3 characters long!']
    },
    stars: {
        type: Number,
        required: [true, 'Stars is requered!'],
        validate: {
            validator: (value) => value >= 1 && value <= 5,
            message: 'The Stars should be a positive number between 1 and 5'
        }
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    wishingList: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
});


//create Model 
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;