const router = require('express').Router();

const homeController = require('./controllers/homeController');
const auctionController = require('./controllers/auctionController');
const userController = require('./controllers/userController');

router.use(homeController);
router.use('/auction', auctionController);
router.use('/users', userController);
router.get('*', (req, res) => {
    res.redirect("/404")
});

module.exports = router;