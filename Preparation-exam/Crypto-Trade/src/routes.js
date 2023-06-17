const router = require('express').Router();

const homeController = require('./controllers/homeController');
const offerController = require('./controllers/offerController');
const userController = require('./controllers/userController');

router.use(homeController);
router.use('/offer', offerController);
router.use('/users', userController);
router.get('*', (req, res) => {
    res.redirect("/404")
});

module.exports = router;