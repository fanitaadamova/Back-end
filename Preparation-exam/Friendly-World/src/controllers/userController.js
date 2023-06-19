const router = require('express').Router();

const userManager = require('../managers/userManager');
const { extractErrorMessages } = require('../utils/errorHelpers');

router.get('/register', (req, res) => {
    res.render('users/register', { title: 'Register Page' });
});

router.post('/register', async (req, res) => {
    const { email, password, repeatPassword } = req.body;

    try {
        const token = await userManager.register({ email, password, repeatPassword });

        res.cookie('auth', token, { httpOnly: true });
        res.redirect('/');

    } catch (err) {
        const errorMessages = extractErrorMessages(err);
        res.status(404).render('users/register', { errorMessages, title: 'Register Page' });
    }

});

router.get('/login', (req, res) => {
    res.render('users/login', { title: 'Login Page' });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await userManager.login(email, password);

        res.cookie('auth', token, { httpOnly: true });

        res.redirect('/');

    } catch (err) {
        const errorMessages = extractErrorMessages(err);
        res.status(404).render('users/login', { errorMessages, title: 'Login Page' });
    }

});

router.get('/logout', (req, res) => {
    res.clearCookie('auth');

    res.redirect('/');
})


module.exports = router;