const mongoose = require('mongoose');
//TODO: add correct uri
const uri = 'mongodb://127.0.0.1:27017/Petstagram'

async function dbConnect() {
  await mongoose.connect(uri);
}

module.exports = dbConnect;