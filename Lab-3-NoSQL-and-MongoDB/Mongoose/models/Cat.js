const mongoose = require('mongoose');

//схемата е описание на модела, като вътре описваме всяко едно пропърти
//create Shema
const catShema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        maxLength: 20,
        required: true,
    },
    age: Number,
    breed: String,
});
//create Method
catShema.methods.greet = function () {
    console.log(`Hello, I am - my name is ${this.name}`);
}
//create virtual property
catShema.virtual('info').get(function () {
    return `My name is ${this.name} and I am ${this.breed}`;
})
//create Model
const Cat = mongoose.model('Cat', catShema);

module.exports = Cat;