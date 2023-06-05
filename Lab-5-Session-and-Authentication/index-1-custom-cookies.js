const express = require('express');
const { v4: uuid } = require('uuid');

const app = express();

app.get('/', (req, res) => {
    let id = uuid();
    //console.log(req.headers.cookie);
    const cookie = req.headers.cookie;
    if (cookie) {
        const [key, value] = cookie.split('=');
        id = value;
    } else {
        res.header('Set-Cookie', `userId=${id}`);
    }

    res.send(`Hello User - ${id}`);
});

app.listen(5000, () => console.log('Server is listening on port 5000.......'));