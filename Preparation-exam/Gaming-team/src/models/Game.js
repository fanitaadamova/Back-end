const mongoose = require('mongoose');

//create Shema
const gameSchema = new mongoose.Schema({
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
    price: {
        type: Number,
        required: [true, 'Price is requered!'],
        validate: {
            validator: (value) => value > 0,
            message: 'The price should be a positive number!'
        }
    },
    description: {
        type: String,
        required: [true, 'Description is requered!'],
        minLength: [10, 'The description should be at least 10 characters long!']
    },
    genre: {
        type: String,
        required: [true, 'Genre is requered!'],
        minLength: [2, 'The Genre should be at least 2 characters long!']
    },
    platform: {
        type: String,
        required: [true, 'Platform is requered!'],
        validate: {
            validator: (value) => {
                const validTypes = ['PC', 'Nintendo', 'PS4', 'PS5', 'XBOX'];
                const indexOftype = validTypes.findIndex(type => type.toLowerCase() === value.toLowerCase());
                if (indexOftype !== -1) {
                    return validTypes[indexOftype];
                }

                return false;
            }
        }

    },
    boughtBy: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
});


gameSchema.pre('save', function (next) {
    const validTypes = ['PC', 'Nintendo', 'PS4', 'PS5', 'XBOX'];
    const indexOftype = validTypes.findIndex(type => type.toLowerCase() === this.platform.toLowerCase());
    if (indexOftype !== -1) {
        this.platform = validTypes[indexOftype];
    }

    next();
});

//create Model 
const Game = mongoose.model('Game', gameSchema);

module.exports = Game;