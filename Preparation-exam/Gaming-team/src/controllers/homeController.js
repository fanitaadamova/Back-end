const router = require('express').Router();
const gameManager = require('../managers/gameManager');


router.get('/', async (req, res) => {

    res.render('home');
});

router.get('/catalog', async (req, res) => {
    const { name, platform } = req.body;

    const games = await gameManager.getAllGames(name, platform);
    res.render('catalog', { games })
});

router.get('/search', async (req, res) => {
    try {
        const { name, platform } = req.body;

        const games = await gameManager.getAllGames(name, platform);
        res.render('search', { games });

    } catch (error) {
        console.error(errorHandler(error).message);
        res.redirect('/search');
    }
});


router.post('/search', async (req, res) => {
    try {
        const { name, platform } = req.body;

        const games = await gameManager.getAllGames(name, platform);
        res.render('search', { games });

    } catch (error) {
        console.error(errorHandler(error).message);
        res.redirect('/search');
    }
});


router.get('/404', (req, res) => {
    res.render("404");
});

module.exports = router;
