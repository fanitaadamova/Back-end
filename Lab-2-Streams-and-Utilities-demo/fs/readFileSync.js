const fs = require('fs');

const text = fs.readFileSync('./input.txt', {encoding: 'utf-8'});

console.log(text);