const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { isAuth } = require('../middlewares/authMiddleware');
const { getPayMethodOptionsViewData } = require('../utils/viewHelpers');

const auctionManager = require('../managers/auctionManager');

const { extractErrorMessages, errorHandler } = require('../utils/errorHelpers');

router.get('/create', isAuth, (req, res) => {
    console.log(req.user);

    res.render('auction/create');
});

router.post('/create',
    body(['title', 'category', 'imageUrl', 'price', 'description']).trim(),
    body('title')
        .notEmpty().withMessage('Title is required').bail()
        .isLength({ min: 4 }).withMessage('Title must be at least 4 characters long'),
    body('category')
        .notEmpty().withMessage('Category is required')
        .custom((value) => ['estate', 'vehicles', 'furniture', 'electronics', 'other'].includes(value))
        .withMessage('Select the correct category'),
    body('imageUrl')
        .notEmpty().withMessage('Image is required'),
    body('price')
        .notEmpty().withMessage('Price is required').bail()
        .isNumeric().withMessage('Price must be a number').bail()
        .custom((value) => value > 0).withMessage('The price cannot be zero or less than zero'),
    body('description')
        .notEmpty().withMessage('Description is required').bail()
        .isLength({ max: 200 }).withMessage('The description should be a maximum of 200 characters long'),
    isAuth, async (req, res) => {

        const { title, category, imageUrl, price, description } = req.body;

        try {
            await auctionManager.createAuction({
                title,
                category,
                imageUrl,
                price,
                description,
                author: req.user._id
            });

            res.redirect('/catalog')

        } catch (err) {
            const errorMessages = extractErrorMessages(err);
            res.status(404).render('auction/create', { errorMessages });
        }


    });

router.get('/:auctionId/details', async (req, res) => {
    const auction = await auctionManager.getAuctionById(req.params.auctionId).lean();

    isCuurentActionHasBidd = auction.bidder.length > 0;

    let isBidder = false;

    if (!auction) {
        return res.redirect('/404');
    }

    isAuthor = auction.author._id?.toString() === req.user?._id;

    if (req.user) {
        const userId = req.user._id;
        const auctionId = req.params.auctionId;
        isBidder = await auctionManager.hasBidder(userId, auctionId);
    }

    res.render("auction/details", { auction, isAuthor, isBidder, isCuurentActionHasBidd })
});

router.get('/:auctionId/edit', isAuth, async (req, res) => {

    const auction = await auctionManager.getAuctionById(req.params.auctionId).lean();

    if (auction.author._id.toString() !== req.user._id) {
        return res.redirect('/404');
    }
    //logic for selected type
    const options = getPayMethodOptionsViewData(auction.category);

    res.render('auction/edit', { auction , options});
});


router.post('/:auctionId/edit',
body(['title', 'category', 'imageUrl', 'price', 'description']).trim(),
body('title')
    .notEmpty().withMessage('Title is required').bail()
    .isLength({ min: 4 }).withMessage('Title must be at least 4 characters long'),
body('category')
    .notEmpty().withMessage('Category is required')
    .custom((value) => ['estate', 'vehicles', 'furniture', 'electronics', 'other'].includes(value))
    .withMessage('Select the correct category'),
body('imageUrl')
    .notEmpty().withMessage('Image is required'),
body('price')
    .notEmpty().withMessage('Price is required').bail()
    .isNumeric().withMessage('Price must be a number').bail()
    .custom((value) => value > 0).withMessage('The price cannot be zero or less than zero'),
body('description')
    .notEmpty().withMessage('Description is required').bail()
    .isLength({ max: 200 }).withMessage('The description should be a maximum of 200 characters long'),
    async (req, res) => {

        //NEW LOGIC 

        const auction = req.body;
        const auctionId = req.params.auctionId;

        console.log(req.body);

        try {
            const { errors } = validationResult(req);

            if (errors.length !== 0) {
                throw errors;
            }

            const updatedAuction = await auctionManager.updateAuction(auctionId, auction);

            res.redirect(`/auction/${auctionId}/details`);

        } catch (err) {
            //NEW LOGIC errorHandler util folder
            const errorMessages = errorHandler(err).message;

            auction._id = auctionId;
            res.render('auction/edit', { errorMessages, auction });
        }


    })


router.get('/:auctionId/bidder', async (req, res) => {

    const auctionId = req.params.auctionId;
    const userId = req.user._id;
    try {
        await auctionManager.bidderAuction(auctionId, userId);

        res.redirect(`/auction/${auctionId}/details`);
    } catch (error) {
        console.error(errorHandler(error).message);
        res.redirect(`/auction/${auctionId}/details`);
    }


});

router.get('/:auctionId/delete', isAuth, async (req, res) => {

    await auctionManager.deleteAuction(req.params.auctionId);
    res.redirect('/catalog');
});



module.exports = router;