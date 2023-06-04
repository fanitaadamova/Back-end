const fs = require('fs');

const text = 'Az obicham javascipt';

fs.writeFile('./output.txt', text, 'utf-8', (err) => {
    if (err) {
        console.log('Unsuccessful file save!');
    }

    console.log('Successfully file saved!');
});