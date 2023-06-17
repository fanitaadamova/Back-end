const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const {auth} = require('../middlewares/authMiddleware');

function expressConfigurater(app) {
    //Static middleware, search static file in public folder
    app.use(express.static(path.resolve(__dirname, '../public')));
    //Add third party middleware 
    const bodyParser = express.urlencoded({ extended: false });
    app.use(bodyParser);
    app.use(cookieParser());
    app.use(auth);
}

module.exports = expressConfigurater;