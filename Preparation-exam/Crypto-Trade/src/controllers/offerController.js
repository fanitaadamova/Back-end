const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { isAuth } = require('../middlewares/authMiddleware');
const { getPayMethodOptionsViewData } = require('../utils/viewHelpers');

const offerManager = require('../managers/offerManager');

const { extractErrorMessages, errorHandler } = require('../utils/errorHelpers');

router.get('/create', isAuth, (req, res) => {
    console.log(req.user);

    res.render('offer/create');
});

router.post('/create', isAuth, async (req, res) => {

    const { name,
        imageUrl,
        price,
        description,
        paymendMethod }
        = req.body;

    try {
        await offerManager.createOffer({
            name,
            imageUrl,
            price,
            description,
            paymendMethod,
            owner: req.user._id
        });

        res.redirect('/catalog')

    } catch (err) {
        const errorMessages = extractErrorMessages(err);
        res.status(404).render('offer/create', { errorMessages });
    }


});

router.get('/:offerId/details', async (req, res) => {
    const offer = await offerManager.getOfferById(req.params.offerId).lean();
    let isBought = false;

    if (!offer) {
        return res.redirect('/404');
    }

    isOwner = offer.owner?.toString() === req.user?._id;

    if (req.user) {
        const userId = req.user._id;
        const offerId = req.params.offerId;
        isBought = await offerManager.hasBought(userId, offerId);
    }

    res.render("offer/details", { offer, isOwner, isBought })
});

router.get('/:offerId/edit', isAuth, async (req, res) => {

    const offer = await offerManager.getOfferById(req.params.offerId).lean();

    if (offer.owner.toString() !== req.user._id) {
        return res.redirect('/404');
    }
    //logic for selected type
    const options = getPayMethodOptionsViewData(offer.paymendMethod);

    res.render('offer/edit', { offer, options });
});


router.post('/:offerId/edit',
    body(['paymendMethod', 'name', 'imageUrl', 'price', 'description']).trim(),
    body('paymendMethod').notEmpty().withMessage('Select a valid option, the paymendMethod cannot be empty!'),
    body('name').notEmpty().withMessage('Name is required!').bail()
        .isLength({ min: 2 }).withMessage('The name should be at least 2 characters!'),
    body('imageUrl').notEmpty().withMessage('Image is required!')
        .isURL().withMessage('Image URL is not correct - must start with "http://" or "https://"!').bail()
        .custom((value) => /^https?:\/\//gi.test(value)).withMessage('Image URL does not start with "http://" or "https://"!'),
    body('price').notEmpty().withMessage('Price is required!').bail()
        .isNumeric().withMessage('Price must be a number!').bail()
        .custom((value) => value > 0).withMessage('Price must be a positive number!'),
    body('description').notEmpty().withMessage('Description is required!').bail()
        .isLength({ min: 10 }).withMessage('The description should be at least 10 characters long!'),
    async (req, res) => {

        //NEW LOGIC 

        const offer = req.body;
        const offerId = req.params.offerId;

        try {
            const { errors } = validationResult(req);

            if (errors.length !== 0) {
                throw errors;
            }

            const updatedoffer = await offerManager.updateOffer(offerId, offer);

            res.redirect(`/offer/${offerId}/details`);

        } catch (err) {
            //NEW LOGIC errorHandler util folder
            const errorMessages = errorHandler(err).message;

            offer._id = offerId;
            res.render('offer/edit', { errorMessages, offer });
        }


    })


router.get('/:offerId/buy', async (req, res) => {

    const offerId = req.params.offerId;
    const userId = req.user._id;
    try {
        await offerManager.buyOffer(offerId, userId);

        res.redirect(`/offer/${offerId}/details`);
    } catch (error) {
        console.error(errorHandler(error).message);
        res.redirect(`/offer/${offerId}/details`);
    }


});

router.get('/:offerId/delete', isAuth, async (req, res) => {

    await offerManager.deleteOffer(req.params.offerId);
    res.redirect('/catalog');
});



module.exports = router;