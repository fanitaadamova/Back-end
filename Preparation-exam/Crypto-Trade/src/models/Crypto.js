const mongoose = require('mongoose');

//create Shema
const cryptoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is requered!'],
        minLength: [2, 'The name should be at least 2 characters.']
    },
    imageUrl: {
        type: String,
        required: [true, 'Image is requered!'],
        validate: {
            validator: (value) => /^https?:\/\//.test(value),
            message: 'The Crypto image URL should start with "http://" or "https://"!'
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
    paymendMethod: {
        type: String,
        required: [true, 'PaymendMethod is requered!'],
        validate: {
            validator: (value) => {
                const validTypes = ['Crypto Wallet', 'Credit Card', 'Debit Card', 'PayPal'];
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


cryptoSchema.pre('save', function (next) {
    const validTypes = ['Crypto Wallet', 'Credit Card', 'Debit Card', 'PayPal'];
    const indexOftype = validTypes.findIndex(type => type.toLowerCase() === this.paymendMethod.toLowerCase());
    if (indexOftype !== -1) {
        this.paymendMethod = validTypes[indexOftype];
    }

    next();
});

//create Model 
const Crypto = mongoose.model('Crypto', cryptoSchema);

module.exports = Crypto;