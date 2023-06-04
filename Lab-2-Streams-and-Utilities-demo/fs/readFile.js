const fs = require('fs');

//прочети ми файла асинхронно - подаваме трети параметър call back, с който казваме каква ф-ия 
//да се изпълни, когато е готово четенето, evemt loop-a не се блокира
const text = fs.readFile('./input.txt', 'utf-8', (err, text) => {
    if(err){
        console.log(err);
        return
    }
    console.log(text);
});

console.log('end');
