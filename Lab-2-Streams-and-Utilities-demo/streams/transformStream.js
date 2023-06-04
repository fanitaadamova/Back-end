const fs = require('fs');
const zlib = require('zlib');

const gzib = zlib.createGzip();
const readStream = fs.createReadStream('./input.txt', { encoding: 'utf-8' });
const writeStream = fs.createWriteStream('./output.txt', { encoding: 'utf-8' });

//взима ги, компресира ги и след това ги записва
readStream.pipe(gzib).pipe(writeStream);