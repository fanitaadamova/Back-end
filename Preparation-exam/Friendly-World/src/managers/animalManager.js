const Animal = require('../models/Animal');


exports.getAllAnimals = async (location) => {
    let result = await Animal.find().lean();

    if (location) {
        result = result.filter(animal => animal.location.toLowerCase().includes(location.toLowerCase()));
    }

    return result
};

exports.getLast3 = async () => {

    let result = await Animal.find({},{},{ sort: { _id: -1 } }).limit(3).lean();
    return result
}




exports.getAnimalById = (animalId) => Animal.findById(animalId);

exports.updateAnimal = (animalId, data) => Animal.findByIdAndUpdate(animalId, data);

exports.deleteAnimal = (animalId) => Animal.findByIdAndDelete(animalId);

exports.donateAnimal = async (animalId, userId) => {
    const animal = await Animal.findById(animalId);
    if (animal.donations.includes(userId)) {
        throw new Error('Animal is alredy donated!');
    }

    animal.donations.push(userId);
    await animal.save();
}

exports.createAnimal = async (animalData) => {
    const animal = new Animal(animalData);
    await animal.save();
    console.log(animal);
    return animal;
};

exports.hasDonated = async (userId, animalId) => {
    const animal = await Animal.findById(animalId);
    return animal.donations.includes(userId);
};

