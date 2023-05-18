const fs = require('fs');

//create read stream
const readStream = fs.createReadStream('./input.txt', { encoding: 'utf-8' });

//data , в която имаме chunk 64 kb
readStream.on('data', (chunk) => {
    console.log('Reed chunk');
    console.log(chunk);
});

readStream.on('end', () => {
    console.log('Reeding data is finish');
});