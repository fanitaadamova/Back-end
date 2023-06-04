const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');

const app = express();
const secret = 'alabalasecretstochadura';

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }))

const users = {};

app.get('/', (req, res) => {

    res.send('Hello')
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
        //generate JWT token
        const payloads = { username };
        jwt.sign(payloads, secret, { expiresIn: '2d' }, (err, token) => {
            if (err) {
                return res.redirect('/404');
            }

            //set JWT token as cookie
            res.cookie('token', token);
            res.redirect('/profile');
        });

    } else {
        res.status(401).send('Unauthorized');
    }
});

app.get('/profile', (req, res) => {
    //Get token from cookie
      const token = req.cookies['token'];

    //Verify token
     if(token){
        jwt.verify(token, secret, (err, decodedToken)=>{
            if(err){
                return res.status(401).send('Unauthorized');
            }
            //Allow request is valid
            res.send(`Profile: ${decodedToken.username}`);
        });
     }

     return res.status(401).send('Unauthorized');

});

app.listen(5000, () => console.log('Server is listening on port 5000.......'));