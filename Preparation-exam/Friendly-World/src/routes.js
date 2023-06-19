const router = require('express').Router();

const homeController = require('./controllers/homeController');
const animalController = require('./controllers/animalController');
const userController = require('./controllers/userController');

router.use(homeController);
router.use('/animal', animalController);
router.use('/users', userController);
router.get('*', (req, res) => {
    res.redirect("/404")
});

module.exports = router;