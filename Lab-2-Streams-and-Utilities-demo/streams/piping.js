const fs = require('fs');

const readStream = fs.createReadStream('./input.txt', { encoding: 'utf-8' });
const writeStream = fs.createWriteStream('./output.txt', { encoding: 'utf-8' });

readStream.pipe(writeStream);