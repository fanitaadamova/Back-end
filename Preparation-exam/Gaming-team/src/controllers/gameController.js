const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { isAuth } = require('../middlewares/authMiddleware');
const { getPlatformOptionsViewData } = require('../utils/viewHelpers');

const gameManager = require('../managers/gameManager');

const { extractErrorMessages, errorHandler } = require('../utils/errorHelpers');

router.get('/create', isAuth, (req, res) => {
    console.log(req.user);

    res.render('game/create');
});

router.post('/create', isAuth, async (req, res) => {

    const { name,
        imageUrl,
        price,
        description,
        genre,
        platform }
        = req.body;

    try {
        await gameManager.createGame({
            name,
            imageUrl,
            price,
            description,
            genre,
            platform,
            owner: req.user._id
        });

        res.redirect('/catalog')

    } catch (err) {
        const errorMessages = extractErrorMessages(err);
        res.status(404).render('game/create', { errorMessages });
    }


});

router.get('/:gameId/details', async (req, res) => {
    const game = await gameManager.getGameById(req.params.gameId).lean();
    let isBought = false;
    let isLogin = false;
    if (!game) {
        return res.redirect('/404');
    }

    isOwner = game.owner?.toString() === req.user?._id;
    if (req.user) {
        isLogin = true;
        const userId = req.user._id;
        const gameId = req.params.gameId;
        isBought = await gameManager.hasBought(userId, gameId);
        console.log(isBought);
    }

    res.render("game/details", { game, isLogin, isOwner, isBought })
});

router.get('/:gameId/edit', isAuth, async (req, res) => {

    const game = await gameManager.getGameById(req.params.gameId).lean();

    if (game.owner.toString() !== req.user._id) {
        return res.redirect('/404');
    }
    //logic for selected type
    const options = getPlatformOptionsViewData(game.platform);

    res.render('game/edit', { game, options });
});



router.post('/:gameId/edit',
    body(['platform', 'name', 'imageUrl', 'price', 'genre', 'description']).trim(),
    body('platform').notEmpty().withMessage('Select a valid option, the platform cannot be empty!'),
    body('name').notEmpty().withMessage('Name is required!').bail()
        .isLength({ min: 4 }).withMessage('The name should be at least 4 characters!'),
    body('imageUrl').notEmpty().withMessage('Image is required!')
        .isURL().withMessage('Image URL is not correct - must start with "http://" or "https://"!').bail()
        .custom((value) => /^https?:\/\//gi.test(value)).withMessage('Image URL does not start with "http://" or "https://"!'),
    body('price').notEmpty().withMessage('Price is required!').bail()
        .isNumeric().withMessage('Price must be a number!').bail()
        .custom((value) => value >= 0).withMessage('Price must be a positive number!'),
    body('genre').notEmpty().withMessage('Genre is required!')
        .isLength({ min: 2 }).withMessage('The genre should be at least 2 characters long!'),
    body('description').notEmpty().withMessage('Description is required!').bail()
        .isLength({ min: 10 }).withMessage('The description should be at least 10 characters long!'),
    async (req, res) => {

        //NEW LOGIC 

        const game = req.body;
        const gameId = req.params.gameId;

        try {
            const { errors } = validationResult(req);

            if (errors.length !== 0) {
                throw errors;
            }

            const updatedGame = await gameManager.updateGame(gameId, game);

            res.redirect(`/game/${gameId}/details`);

        } catch (err) {
            //NEW LOGIC errorHandler util folder
            const errorMessages = errorHandler(err).message;

            game._id = gameId;
            res.render('game/edit', { errorMessages, game });
        }


    })


router.get('/:gameId/buy', async (req, res) => {

    const gameId = req.params.gameId;
    const userId = req.user._id;
    try {
        await gameManager.buyGame(gameId, userId);

        res.redirect(`/game/${gameId}/details`);
    } catch (error) {
        console.error(errorHandler(error).message);
        res.redirect(`/game/${gameId}/details`);
    }


});

router.get('/:gameId/delete', isAuth, async (req, res) => {

    await gameManager.deleteGame(req.params.gameId);
    res.redirect('/catalog');
});



module.exports = router;