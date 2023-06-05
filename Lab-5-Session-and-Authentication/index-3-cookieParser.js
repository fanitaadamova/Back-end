const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const { v4: uuid } = require('uuid');

const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }))

const session = {};

app.get('/', (req, res) => {
    let id;

    const userId = req.cookies['userId'];

    if (userId) {
        id = userId;
        console.log(req.session.secret);
    } else {
        id = uuid();
        res.cookie('userId', id, { httpOnly: true });
    }

    res.send(`Hello User - ${id}`);
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

app.post('/login', async (req, res)=>{
    const {username, password} = req.body;

    const sault = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, sault);

    console.log(username, password);
    res.send(hash)
})

app.listen(5000, () => console.log('Server is listening on port 5000.......'));