const router = require('express').Router();
const animalManager = require('../managers/animalManager');


router.get('/', async (req, res) => {

    const animalsHome = await animalManager.getLast3()

    res.render('home', { animalsHome ,  title: 'Home Page'});
});

router.get('/catalog', async (req, res) => {
    const { location } = req.body;

    const animals = await animalManager.getAllAnimals(location);
    res.render('dashboard', { animals ,  title: 'Dashboard Page'})
});

router.get('/search', async (req, res) => {
    try {
        const { location } = req.body;

        const animals = await animalManager.getAllAnimals(location);
        res.render('search', { animals , title: 'Search Page' });

    } catch (error) {
        console.error(errorHandler(error).message);
        res.redirect('/search' , { title: 'Search Page' });
    }
});


router.post('/search', async (req, res) => {
    try {
        const { location } = req.body;

        const animals = await animalManager.getAllAnimals(location);
        res.render('search', { animals , title: 'Search Page'});

    } catch (error) {
        console.error(errorHandler(error).message);
        res.redirect('/search' , { title: 'Search Page' });
    }
});


router.get('/404', (req, res) => {
    res.render("404" , { title: '404 Page' });
});

module.exports = router;
