const router = require('express').Router();

const homeController = require('./controllers/homeController');
const bookController = require('./controllers/bookController');
const userController = require('./controllers/userController');

router.use(homeController);
router.use('/book', bookController);
router.use('/users', userController);
router.get('*', (req, res) => {
    res.redirect("/404")
});

module.exports = router;