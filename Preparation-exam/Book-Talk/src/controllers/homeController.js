const router = require('express').Router();
const bookManager = require('../managers/bookManager');
const { isAuth } = require('../middlewares/authMiddleware');

router.get('/', async (req, res) => {

    res.render('home');
});

router.get('/catalog', async (req, res) => {

    const books = await bookManager.getAllBooks().lean();
    res.render('catalog', { books })

});


router.get('/404', (req, res) => {
    res.render("404");
});

router.get('/profile', isAuth, async (req, res) => {

    const books = await bookManager.getAllBooks().lean();

    const booksWishes = books
        .filter(book => book.wishingList.some(el => el._id.toString() == req.user._id?.toString()));

    res.render('profile', { booksWishes })

});


module.exports = router;
