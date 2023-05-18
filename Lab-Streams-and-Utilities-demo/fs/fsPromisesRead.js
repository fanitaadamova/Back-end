const fs = require('fs/promises');

fs.readFile('./input.txt', 'utf8')
    .then(data => {
        console.log(data);
    })



