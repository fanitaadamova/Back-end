const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { isAuth } = require('../middlewares/authMiddleware');
const { getPlatformOptionsViewData } = require('../utils/viewHelpers');

const animalManager = require('../managers/animalManager');

const { extractErrorMessages, errorHandler } = require('../utils/errorHelpers');

router.get('/create', isAuth, (req, res) => {
    console.log(req.user);

    res.render('animal/create',  { title: 'Create Page' });
});

router.post('/create', isAuth, async (req, res) => {

    const { name,
        years,
        kind,
        imageUrl,
        need,
        location,
        description }
        = req.body;

    try {
        await animalManager.createAnimal({
            name,
            years,
            kind,
            imageUrl,
            need,
            location,
            description,
            owner: req.user._id
        });

        res.redirect('/catalog')

    } catch (err) {
        const errorMessages = extractErrorMessages(err);
        res.status(404).render('animal/create', { errorMessages ,   title: 'Create Page' });
    }


});

router.get('/:animalId/details', async (req, res) => {
    const animal = await animalManager.getAnimalById(req.params.animalId).lean();
    let isDonated = false;

    if (!animal) {
        return res.redirect('/404');
    }

    isOwner = animal.owner?.toString() === req.user?._id;
    if (req.user) {
        const userId = req.user._id;
        const animalId = req.params.animalId;
        isDonated = await animalManager.hasDonated(userId, animalId);
        console.log(isDonated);
    }

    res.render("animal/details", { animal, isOwner, isDonated , title: 'Details Page' })
});

router.get('/:animalId/edit', isAuth, async (req, res) => {

    const animal = await animalManager.getAnimalById(req.params.animalId).lean();

    if (animal.owner.toString() !== req.user._id) {
        return res.redirect('/404');
    }
    //logic for selected type
    const options = getPlatformOptionsViewData(animal.platform);

    res.render('animal/edit', { animal, options , title: 'Edit Page'});
});

//  'description'

router.post('/:animalId/edit', isAuth,
    body(['name', 'years', 'kind', 'imageUrl', 'need', 'location', 'description']).trim(),
    body('name').notEmpty().withMessage('Name is required!').bail()
        .isLength({ min: 2 }).withMessage('The name should be at least 2 characters!'),
    body('imageUrl').notEmpty().withMessage('Image is required!')
        .isURL().withMessage('Image URL is not correct - must start with "http://" or "https://"!').bail()
        .custom((value) => /^https?:\/\//gi.test(value)).withMessage('Image URL does not start with "http://" or "https://"!'),
    body('years').notEmpty().withMessage('Years is required!').bail()
        .isNumeric().withMessage('Years must be a number!').bail()
        .custom((value) => value >= 1 && value <= 100).withMessage('The age should be at betwen 1 and 100!!'),
    body('kind').notEmpty().withMessage('Kind is required!')
        .isLength({ min: 3 }).withMessage('The kind should be at least 3 characters!'),
    body('need').notEmpty().withMessage('Need is required!')
        .isLength({ min: 3, max: 20 }).withMessage('The need should be at least 3 and no longer than 20 characters!'),
    body('location').notEmpty().withMessage('Location is required!')
        .isLength({ min: 5, max: 15 }).withMessage('The location should be at least 5 and no longer than 15 characters!'),
    body('description').notEmpty().withMessage('Description is required!')
        .isLength({ min: 5, max: 50 }).withMessage('The description should be at least 5 and no longer than 50 characters!'),
    async (req, res) => {

        //NEW LOGIC 

        const animal = req.body;
        const animalId = req.params.animalId;

        try {
            const { errors } = validationResult(req);

            if (errors.length !== 0) {
                throw errors;
            }

            const updatedAnimal = await animalManager.updateAnimal(animalId, animal);

            res.redirect(`/animal/${animalId}/details`);

        } catch (err) {
            //NEW LOGIC errorHandler util folder
            const errorMessages = errorHandler(err).message;

            animal._id = animalId;
            res.render('animal/edit', { errorMessages, animal, title: 'Edit Page' });
        }


    })


router.get('/:animalId/donate', isAuth, async (req, res) => {

    const animalId = req.params.animalId;
    const userId = req.user._id;
    try {
        await animalManager.donateAnimal(animalId, userId);

        res.redirect(`/animal/${animalId}/details`);
    } catch (error) {
        console.error(errorHandler(error).message);
        res.redirect(`/animal/${animalId}/details`);
    }


});

router.get('/:animalId/delete', isAuth, async (req, res) => {

    await animalManager.deleteAnimal(req.params.animalId);
    res.redirect('/catalog');
});



module.exports = router;