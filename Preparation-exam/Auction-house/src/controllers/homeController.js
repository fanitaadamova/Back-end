const router = require('express').Router();
const auctionManager = require('../managers/auctionManager');


router.get('/', async (req, res) => {

    res.render('home');
});

router.get('/catalog', async (req, res) => {
    const { name, paymendMethod } = req.body;

    const auctions = await auctionManager.getAllAuctions(name, paymendMethod);
    res.render('browse', { auctions })
});

router.get('/search', async (req, res) => {
    try {
        const { name, paymendMethod } = req.body;

        const auctions = await auctionManager.getAllAuctions(name, paymendMethod);
        res.render('search', { auctions });

    } catch (error) {
        console.error(errorHandler(error).message);
        res.redirect('/search');
    }
});


router.post('/search', async (req, res) => {
    try {
        const { name, paymendMethod } = req.body;

        const auctions = await auctionManager.getAllAuctions(name, paymendMethod);
        res.render('search', { auctions });

    } catch (error) {
        console.error(errorHandler(error).message);
        res.redirect('/search');
    }
});


router.get('/404', (req, res) => {
    res.render("404");
});

module.exports = router;
