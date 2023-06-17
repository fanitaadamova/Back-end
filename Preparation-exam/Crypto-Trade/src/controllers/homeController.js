const router = require('express').Router();
const offerManager = require('../managers/offerManager');


router.get('/', async (req, res) => {

    res.render('home');
});

router.get('/catalog', async (req, res) => {
    const { name, paymendMethod } = req.body;

    const offers = await offerManager.getAllOffers(name, paymendMethod);
    res.render('catalog', { offers })
});

router.get('/search', async (req, res) => {
    try {
        const { name, paymendMethod } = req.body;

        const offers = await offerManager.getAllOffers(name, paymendMethod);
        res.render('search', { offers });

    } catch (error) {
        console.error(errorHandler(error).message);
        res.redirect('/search');
    }
});


router.post('/search', async (req, res) => {
    try {
        const { name, paymendMethod } = req.body;

        const offers = await offerManager.getAllOffers(name, paymendMethod);
        res.render('search', { offers });

    } catch (error) {
        console.error(errorHandler(error).message);
        res.redirect('/search');
    }
});


router.get('/404', (req, res) => {
    res.render("404");
});

module.exports = router;
