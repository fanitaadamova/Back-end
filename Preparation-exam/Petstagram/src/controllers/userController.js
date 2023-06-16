const router = require('express').Router();

const userManager = require('../managers/userManager');
const { extractErrorMessages, errorHandler } = require('../utils/errorHelpers');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', async (req, res) => {
    const { username, email, password, repeatPassword } = req.body;

    try {
        const token = await userManager.register({ username, email, password, repeatPassword });
        
        res.cookie('auth', token, { httpOnly: true });
        res.redirect('/');

    } catch (err) {
        const errorMessages = extractErrorMessages(err);
        //const errorMessages = errorHandler(err).message;
        res.status(404).render('users/register', { errorMessages });
    }

});

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const token = await userManager.login(username, password);

        res.cookie('auth', token, { httpOnly: true });

        res.redirect('/');

    } catch (err) {
        const errorMessages = extractErrorMessages(err);
        res.status(404).render('users/login', { errorMessages });
    }

});

router.get('/logout', (req, res) => {
    res.clearCookie('auth');

    res.redirect('/');
})


module.exports = router;