const express = require('express');

const expressConfigurater = require('./config/expressConfigurater');
const handlebarsConfigurater = require('./config/handlebarsConfigurater');
const dbConnect = require('./config/dbConfigurater');
const routes = require('./routes');

const app = express();

const PORT = 3000;

expressConfigurater(app);
handlebarsConfigurater(app);

dbConnect()
    .then(() => console.log('DB connect successfully'))
    .catch(err => {
        console.log('DB error ', err)
    });

app.use(routes);

app.listen(PORT, () => console.log(`Server is running ot posrt ${PORT}....`));