const http = require('http');
const fs = require('fs/promises');
const fss = require('fs');
const formidable = require('formidable')

const cats = require('./data/cats.json');


const server = http.createServer(async (req, res) => {
    console.log(req.url);

    if (req.url == '/' && req.method === "GET") {
        const homePage = await fs.readFile('./views/home.html', 'utf-8');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        const catsHtml = cats.map(cat => catTemplate(cat)).join('');
        const resulOfHomepage = homePage.replace('{{cats}}', catsHtml)
        res.write(resulOfHomepage);
    } else if (req.url == '/styles/site.css') {
        const cssFile = await fs.readFile('./content/styles/site.css')
        res.writeHead(200, { 'Content-Type': 'text/css' })
        res.write(cssFile);
    } else if (req.url == '/cats/add-breed' && req.method === "GET") {
        const addBreadPage = await fs.readFile('./views/addBreed.html', 'utf-8')
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.write(addBreadPage);
    } else if (req.url == '/cats/add-cat' && req.method === "GET") {
        const addCatPage = await fs.readFile('./views/addCat.html', 'utf-8')
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.write(addCatPage);
    } else if (/cats\/\d+\/edit/.test(req.url) && req.method === "GET") {
        let catID = req.url.split('/')[2];
        let cat = cats.find(x => x.id == catID);
        let editCatPage = await fs.readFile('./views/editCat.html', 'utf-8');
        editCatPage = editCatPage.replaceAll('{{name}}', cat.name);
        editCatPage = editCatPage.replaceAll('{{description}}', cat.description);
        editCatPage = editCatPage.replaceAll('{{image}}', cat.image);
        editCatPage = editCatPage.replaceAll('{{breed}}', cat.breed);
        editCatPage = editCatPage.replaceAll('{{id}}', cat.id);

        res.write(editCatPage)
    }else if (/cats\/\d+\/shelter/.test(req.url) && req.method === "GET") {
        let catID = req.url.split('/')[2];
        let cat = cats.find(x => x.id == catID);
        let shalterCatPage = await fs.readFile('./views/catShelter.html', 'utf-8');
        shalterCatPage = shalterCatPage.replaceAll('{{name}}', cat.name);
        shalterCatPage = shalterCatPage.replaceAll('{{description}}', cat.description);
        shalterCatPage = shalterCatPage.replaceAll('{{image}}', cat.image);
        shalterCatPage = shalterCatPage.replaceAll('{{breed}}', cat.breed);
        shalterCatPage = shalterCatPage.replaceAll('{{id}}', cat.id);

        res.write(shalterCatPage)
    }
    
    else {
        res.write(`<h1>404 Not found</h1>`);
    }

    res.end();
});

//само за теста ползвам синхронна ф-ия
 function catTemplate(cat) {
    let htmlCat = fss.readFileSync('./views/partials/cat.html', {encoding: 'utf-8'});
    let result = htmlCat.replaceAll('{{name}}', cat.name);
    result = result.replaceAll('{{description}}', cat.description);
    result = result.replaceAll('{{image}}', cat.image);
    result = result.replaceAll('{{breed}}', cat.breed);
    result = result.replaceAll('{{id}}', cat.id);

    return result
}


server.listen(3000, () => console.log('This server is runnung on port 3000.......'))