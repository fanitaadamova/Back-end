const mongoose = require('mongoose');

const Cat = require('./models/Cat');

async function connectDb() {
    await mongoose.connect('mongodb://127.0.0.1:27017/catShelter');

    console.log('Db connested succsessfully');

    const cats = await Cat.find({ breed: "Bombay Cat" });
    cats.forEach(cat => cat.greet())
    //Virtual property generated 
    cats.forEach(cat => console.log(cat.info))

}
connectDb()