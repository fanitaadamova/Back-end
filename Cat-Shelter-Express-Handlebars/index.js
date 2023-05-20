const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const app = express();
const cats = require('./data/cats.json');
const { log } = require('console');


//Add handlebars to express
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');

//Add third party middleware - ако искаме да изпратим примерно данни от страницата на server-a го ползваме
const bodyParser = express.urlencoded({ extended: false });
app.use(bodyParser);
//Static middleware, s който казваме да се търсят статични файлове в папка public
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('home', { cats });
});
app.get('/cats/add-cat', (req, res) => {
    res.render('addCat');
});
app.get('/cats/add-breed', (req, res) => {
    res.render('addBreed');
});


app.post('/cats/add-cat', (req, res) => {
    let id = cats.length + 1;
    addCat(id, req.body.name, req.body.breed, req.body.description, req.body.image)
    res.redirect('/');
});

addCat = (id, name, breed, description, image) => {
    cats.push({ id, name, breed, description, image });
};

app.get('/cats/edit/:catId', (req, res) => {
    const catId = Number(req.params.catId);
    if (!catId) {
        return res.status(404).send('Can not find a cat')
    }
    let cat = cats.find(x => x.id == catId);
    res.render('editCat', cat);
});

app.get('/cats/shelter/:catId', (req, res) => {
    const catId = Number(req.params.catId);
    if (!catId) {
        return res.status(404).send('Can not find a cat')
    }
    let cat = cats.find(x => x.id == catId);
    res.render('catShelter', cat);
});

app.post('/cats/edit/:catId', (req, res) => {
    const catId = Number(req.params.catId);
    if (!catId) {
        return res.status(404).send('Can not find a cat')
    }
    for (const x of cats) {
        if (x.id == catId) {
            x.name = req.body.name,
                x.breed = req.body.breed,
                x.description = req.body.description,
                x.image = req.body.image
        }
    }
    res.redirect('/');
});


app.get('*', (req, res) => {
    res.status(404).send('Not found');
    res.render(`The page not found!`);
});
app.post('*', (req, res) => {
    res.status(404).send('Not found');
    res.render(`The page not found!`);
});

//End of expres router
app.listen(3000, () => console.log('Server is listening ot port 3000..'))
