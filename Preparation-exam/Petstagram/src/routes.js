const router = require('express').Router();

const homeController = require('./controllers/homeController');
const photoController = require('./controllers/photoController');
const userController = require('./controllers/userController');

router.use(homeController);
router.use('/photo', photoController);
router.use('/users', userController);
router.get('*', (req, res) => {
    res.redirect("/404")
});

module.exports = router;