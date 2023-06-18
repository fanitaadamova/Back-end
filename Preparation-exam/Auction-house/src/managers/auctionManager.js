const Auction = require('../models/Auction');


exports.getAllAuctions = async (name, paymendMethod ) => {
    let result = await Auction.find().lean();

    if (name) {
        result = result.filter(auction => auction.name.toLowerCase().includes(name.toLowerCase()));
    }

    if (paymendMethod) {
        result = result.filter(auction => auction.paymendMethod.toLowerCase().includes(paymendMethod.toLowerCase()));
    }

    return result
};

exports.getAuctionById = (auctionId) => Auction.findById(auctionId).populate('author');

exports.updateAuction = (auctionId, data) => Auction.findByIdAndUpdate(auctionId, data);

exports.deleteAuction = (auctionId) => Auction.findByIdAndDelete(auctionId);

exports.bidderAuction = async (auctionId, userId) => {
    const auction = await Auction.findById(auctionId);
    if (auction.bidder.includes(userId)) {
        throw new Error('Product is alredy bought!');
    }

    auction.bidder.push(userId);
    await auction.save();
}

exports.createAuction = async (auctionData) => {
    const auction = new Auction(auctionData);
    await auction.save();
    console.log(auction);
    return auction;
};

exports.hasBidder = async (userId, auctionId) => {
    const auction = await Auction.findById(auctionId);
    return auction.bidder.includes(userId);
};

