const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { isAuth } = require('../middlewares/authMiddleware');

const bookManager = require('../managers/bookManager');

const { extractErrorMessages, errorHandler } = require('../utils/errorHelpers');

router.get('/create', isAuth, (req, res) => {
    console.log(req.user);

    res.render('book/create');
});

router.post('/create', isAuth, async (req, res) => {

    const { title,
        author,
        genre,
        stars,
        imageUrl,
        review
    }
        = req.body;


    try {
        await bookManager.createBook({
            title,
            author,
            genre,
            stars,
            imageUrl,
            review,
            owner: req.user._id
        });

        res.redirect('/catalog')

    } catch (err) {
        const errorMessages = extractErrorMessages(err);
        res.status(404).render('book/create', { errorMessages });
    }


});

router.get('/:bookId/details', async (req, res) => {
    const book = await bookManager.getBookById(req.params.bookId).lean();
    let isWishes = false;
    if (!book) {
        return res.redirect('/404');
    }

    isOwner = book.owner?.toString() === req.user?._id;
    if (req.user) {
        const userId = req.user._id;
        const bookId = req.params.bookId;
        isWishes = await bookManager.hasWishes(userId, bookId);
        console.log(isWishes);
    }

    res.render("book/details", { book, isOwner, isWishes })
});

router.get('/:bookId/edit', isAuth, async (req, res) => {

    const book = await bookManager.getBookById(req.params.bookId).lean();

    if (book.owner.toString() !== req.user._id) {
        return res.redirect('/404');
    }

    res.render('book/edit', { book });
});

router.post('/:bookId/edit', isAuth,
    body(['title', 'author', 'imageUrl', 'stars', 'genre', 'review']).trim(),
    body('title').notEmpty().withMessage('Select a valid option, the title cannot be empty!').bail()
        .isLength({ min: 2 }).withMessage('The title should be at least 2 characters!'),
    body('author').notEmpty().withMessage('Name is required!').bail()
        .isLength({ min: 5 }).withMessage('The author should be at least 5 characters!'),
    body('imageUrl').notEmpty().withMessage('Image is required!')
        .isURL().withMessage('Image URL is not correct - must start with "http://" or "https://"!').bail()
        .custom((value) => /^https?:\/\//gi.test(value)).withMessage('Image URL does not start with "http://" or "https://"!'),
    body('stars').notEmpty().withMessage('Price is required!').bail()
        .isNumeric().withMessage('Stars must be a number!').bail()
        .custom((value) => value >= 1 && value <= 5).withMessage('The Stars should be a positive number between 1 and 5!'),
    body('genre').notEmpty().withMessage('Genre is required!')
        .isLength({ min: 3 }).withMessage('The genre should be at least 3 characters long!'),
    body('review').notEmpty().withMessage('Description is required!').bail()
        .isLength({ min: 10 }).withMessage('The review should be at least 10 characters long!'),
    async (req, res) => {

        //NEW LOGIC 

        const book = req.body;
        const bookId = req.params.bookId;

        try {
            const { errors } = validationResult(req);

            if (errors.length !== 0) {
                throw errors;
            }

            const updatedBook = await bookManager.updateBook(bookId, book);

            res.redirect(`/book/${bookId}/details`);

        } catch (err) {
            //NEW LOGIC errorHandler util folder
            const errorMessages = errorHandler(err).message;

            book._id = bookId;
            res.render('book/edit', { errorMessages, book });
        }


    })


router.get('/:bookId/delete', isAuth, async (req, res) => {

    await bookManager.deleteBook(req.params.bookId);
    res.redirect('/catalog');
});



//wish

router.get('/:bookId/wish', async (req, res) => {

    const bookId = req.params.bookId;
    const userId = req.user._id;
    try {
        await bookManager.wishBook(bookId, userId);

        res.redirect(`/book/${bookId}/details`);
    } catch (error) {
        console.error(errorHandler(error).message);
        res.redirect(`/book/${bookId}/details`);
    }


});


module.exports = router;