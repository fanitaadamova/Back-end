const Game = require('../models/Game');


exports.getAllGames = async (name, platform ) => {
    let result = await Game.find().lean();

    if (name) {
        result = result.filter(game => game.name.toLowerCase().includes(name.toLowerCase()));
    }

    if (platform) {
        result = result.filter(game => game.platform.toLowerCase().includes(platform.toLowerCase()));
    }

    return result
};

exports.getGameById = (gameId) => Game.findById(gameId);

exports.updateGame = (gameId, data) => Game.findByIdAndUpdate(gameId, data);

exports.deleteGame = (gameId) => Game.findByIdAndDelete(gameId);

exports.buyGame = async (gameId, userId) => {
    const game = await Game.findById(gameId);
    if (game.boughtBy.includes(userId)) {
        throw new Error('Product is alredy bought!');
    }

    game.boughtBy.push(userId);
    await game.save();
}

exports.createGame = async (gameData) => {
    const game = new Game(gameData);
    await game.save();
    console.log(game);
    return game;
};

exports.hasBought = async (userId, gameId) => {
    const game = await Game.findById(gameId);
    return game.boughtBy.includes(userId);
};

