const router = require('express').Router();
const photoManager = require('../managers/photoManager');
const { isAuth } = require('../middlewares/authMiddleware');


router.get('/', async (req, res) => {

    res.render('home');
});


router.get('/catalog', async (req, res) => {
    const photos = await photoManager.getAllPhotos().lean();
    res.render('catalog', { photos })
});


router.get('/404', (req, res) => {
    res.render("404");
});

router.get('/profile', isAuth, async (req, res) => {
    const photos = await photoManager.getPhotosbyOwner(req.user._id).lean();
    res.render("profile", { photos, photoCount: photos.length });
});



module.exports = router;
