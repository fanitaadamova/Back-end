const fs = require('fs');
const path = require('path');

//const readStream = fs.createReadStream('./input.txt', { encoding: 'utf-8' });
//const writeStream = fs.createWriteStream('./output.txt', { encoding: 'utf-8' });

//resolve-аме текущия път в който се намираме сега
const readStream = fs.createReadStream(path.resolve(__dirname, 'input.txt' ));
const writeStream = fs.createWriteStream(path.resolve(__dirname, 'output.txt' ));

readStream.on('data', (chunk) => {
    writeStream.write(chunk);
});

readStream.on('end', () => {
    console.log('end');
    writeStream.end();
});