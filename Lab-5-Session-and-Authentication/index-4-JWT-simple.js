const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');

const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }))

const users = {};

app.get('/', (req, res) => {
    const payloads = { _id: uuid(), username: 'Pesho' };
    const options = { expiresIn: '2d' };
    const secret = 'MySuperPrivateSecret';
    const token = jwt.sign(payloads, secret, options);

    console.log(token);
    res.send(token)
    //console.log(users);
    //res.send('ok')
});

app.get('/verify/:token', (req, res) => {
    const token = req.params.token;
    const decodedToken = jwt.verify(token, 'MySuperPrivateSecret');

    console.log(decodedToken);
    res.send('ok')
});

app.get('/register', (req, res) => {
    res.send(`<form method="POST">
    <label for="username">Username</label>
    <input type="text" id="username" name="username">

    <label for="password">Password</label>
    <input type="password" id="password" name="password">
    <input type="submit" value="Register">
</form>
    `)
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    const sault = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, sault);

    users[username] = {
        password: hash,
    };

    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.send(`<form method="POST">
    <label for="username">Username</label>
    <input type="text" id="username" name="username">

    <label for="password">Password</label>
    <input type="password" id="password" name="password">
    <input type="submit" value="Login">
</form>
    `)
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const hash = users[username]?.password;
    const isValid = await bcrypt.compare(password, hash);

    if (isValid) {
        res.send('Successfully logged in!');
    } else {
        res.send('Unauthorized');
    }

});

app.listen(5000, () => console.log('Server is listening on port 5000.......'));