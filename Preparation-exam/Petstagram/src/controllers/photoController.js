const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { isAuth } = require('../middlewares/authMiddleware');

const photoManager = require('../managers/photoManager');

const { extractErrorMessages, errorHandler } = require('../utils/errorHelpers');

router.get('/create', isAuth, (req, res) => {
    console.log(req.user);

    res.render('photo/create');
});

router.post('/create', isAuth, async (req, res) => {

    const { name,
        imageUrl,
        age,
        description,
        location }
        = req.body;

    try {
        await photoManager.createPhoto({
            name,
            imageUrl,
            age,
            description,
            location,
            owner: req.user._id
        });

        res.redirect('/catalog')

    } catch (err) {
        const errorMessages = extractErrorMessages(err);
        res.status(404).render('photo/create', { errorMessages });
    }


});

router.get('/:photoId/details', async (req, res) => {
    const photoId = req.params.photoId;
    const photo = await photoManager.getPhotoById(photoId).populate('comments.user').lean();

    if (!photo) {
        return res.redirect('/404');
    }
    //заради populate след owner вземаме _id , т.е  photo.owner._id , а не photo.owner
    isOwner = photo.owner._id?.toString() === req.user?._id;

    res.render("photo/details", { photo, isOwner })
});

router.get('/:photoId/edit', isAuth, async (req, res) => {

    const photo = await photoManager.getPhotoById(req.params.photoId).lean();
    //populate owner._id
    if (photo.owner._id.toString() !== req.user._id) {
        return res.redirect('/404');
    }

    res.render('photo/edit', { photo });
});


router.post('/:photoId/edit', isAuth,
    body(['name', 'imageUrl', 'age', 'location', 'description']).trim(),
    body('name').notEmpty().withMessage('Name is required!').bail()
        .isLength({ min: 4 }).withMessage('The name should be at least 4 characters!'),
    body('imageUrl').notEmpty().withMessage('Image is required!')
        .isURL().withMessage('Image URL is not correct - must start with "http://" or "https://"!').bail()
        .custom((value) => /^https?:\/\//gi.test(value)).withMessage('Image URL does not start with "http://" or "https://"!'),
    body('age').notEmpty().withMessage('Age is required!').bail()
        .isNumeric().withMessage('Age must be a number!').bail()
        .custom((value) => value > 0 && value < 100).withMessage('The age should be at least 1 and no longer than 100!!'),
    body('location').notEmpty().withMessage('Location is required!')
        .isLength({ min: 5, max: 50 }).withMessage('The location should be at least 5 and no longer than 50 characters!'),
    body('description').notEmpty().withMessage('Description is required!').bail()
        .isLength({ min: 5, max: 50 }).withMessage('The description should be at least 5 and no longer than 50 characters!'),
    async (req, res) => {

        //NEW LOGIC 

        const photo = req.body;
        const photoId = req.params.photoId;

        try {
            const { errors } = validationResult(req);

            if (errors.length !== 0) {
                throw errors;
            }

            const updatedPhoto = await photoManager.updatePhoto(photoId, photo);

            res.redirect(`/photo/${photoId}/details`);

        } catch (err) {
            //NEW LOGIC errorHandler util folder
            const errorMessages = errorHandler(err).message;

            photo._id = photoId;
            res.render('photo/edit', { errorMessages, photo });
        }

    })


router.get('/:photoId/delete', isAuth, async (req, res) => {
    const photoId = req.params.photoId;
    try {
        await photoManager.deletePhoto(photoId);
        res.redirect('/catalog');

    } catch (error) {
        console.error(errorHandler(error).message);
        res.redirect(`/photo/${photoId}/details`);
    }
});

router.post('/:photoId/comments', isAuth, async (req, res) => {
    const photoId = req.params.photoId;
    const { message } = req.body;
    const user = req.user._id;

    try {
        await photoManager.addComment(photoId, { message, user });

        res.redirect(`/photo/${photoId}/details`);
    } catch (error) {
        console.error(errorHandler(error).message);
        res.redirect(`/photo/${photoId}/details`);
    }
})



module.exports = router;