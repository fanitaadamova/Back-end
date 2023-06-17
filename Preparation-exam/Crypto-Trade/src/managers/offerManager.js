const Crypto = require('../models/Crypto');


exports.getAllOffers = async (name, paymendMethod ) => {
    let result = await Crypto.find().lean();

    if (name) {
        result = result.filter(offer => offer.name.toLowerCase().includes(name.toLowerCase()));
    }

    if (paymendMethod) {
        result = result.filter(offer => offer.paymendMethod.toLowerCase().includes(paymendMethod.toLowerCase()));
    }

    return result
};

exports.getOfferById = (offerId) => Crypto.findById(offerId);

exports.updateOffer = (offerId, data) => Crypto.findByIdAndUpdate(offerId, data);

exports.deleteOffer = (offerId) => Crypto.findByIdAndDelete(offerId);

exports.buyOffer = async (offerId, userId) => {
    const offer = await Crypto.findById(offerId);
    if (offer.boughtBy.includes(userId)) {
        throw new Error('Product is alredy bought!');
    }

    offer.boughtBy.push(userId);
    await offer.save();
}

exports.createOffer = async (offerData) => {
    const offer = new Crypto(offerData);
    await offer.save();
    console.log(offer);
    return offer;
};

exports.hasBought = async (userId, offerId) => {
    const offer = await Crypto.findById(offerId);
    return offer.boughtBy.includes(userId);
};

