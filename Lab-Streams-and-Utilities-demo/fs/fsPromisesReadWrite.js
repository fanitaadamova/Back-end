const fs = require('fs/promises');

//read and write file - work with Promises
fs.readFile('./input.txt', 'utf8')
    .then(data => {
        return fs.writeFile('./ouput.txt', data, 'utf8')
    })
    .then(() => {
        console.log('File saved');
    })
