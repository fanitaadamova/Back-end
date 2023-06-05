const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const app = express();

const { addCat, getCats } = require('./cats.js')


//Add handlebars to express
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');

//Add third party middleware - ако искаме да изпратим примерно данни от страницата на server-a го ползваме
const bodyParser = express.urlencoded({ extended: false });
app.use(bodyParser);
//Static middleware, s който казваме да се търсят статични файлове в папка public
app.use(express.static('public'))


//Add middlewares - 2 examples above are Globaled
app.use((req, res, next) => {
    console.log(`middleware 1`);
    next();
});
app.use((req, res, next) => {
    console.log(`HTTP Request ${req.method}: ${req.path}`);
    next();
});

//Partial middlewares 
app.use('/cats', (req, res, next) => {
    console.log(`Cats middleware`);
    next();
});

//Route specific middleware
const specificMiddleware = (req, res, next) => {
    console.log(`Specific middleware only for this route`);
    next();
}

app.get('/specific', specificMiddleware, (req, res,) => {
    res.send(`Some specific route with middleware`);

});

//Expres Router/Actions
//когато имаме method GET и път '/', се изпълнява този Handlerrequest(action)
app.get('/', (req, res) => {
    // res.status(200).send('Hello from Express!');
    //за да не търси layout, слагаме това по-долу
    //res.render('home', { layout: false });
    res.render('home');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/cats', (req, res) => {
    //res.render('cats', { name: 'Pesho', age: 20 });
    const cats = getCats();
    res.render('cats', { cats })
});

app.post('/cats', (req, res) => {
    //console.log(req.body);

    addCat(req.body.name, Number(req.body.age))

    // res.status(201).send('Successfuly created cat :)')
    res.redirect('/cats');
});

app.get('/cats/:catId', (req, res) => {
    const catId = Number(req.params.catId);
    if (!catId) {
        return res.status(404).send('Can not find a cat')
    }
    console.log(req.params);
    res.send(`Request with parameters - ${req.params.catId}`)
})

app.get('/download', (req, res) => {
    //res.download('./doc.pdf');
    //attachment method се ползва за съдържания на стр + файл, слага се end след него
    //res.attachment('./doc.pdf');
    //res.end();
    res.sendFile(path.resolve(__dirname, 'doc.pdf'));
});

app.get('/old-route', (req, res) => {

    res.redirect('/');
});


app.get('*', (req, res) => {
    res.status(404).send('Not found')
});

//End of expres router
app.listen(5000, () => console.log('Server is listening ot port 5000..'))