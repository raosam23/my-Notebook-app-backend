const mongoose = require('mongoose')
const mongoURI = "mongodb://127.0.0.1:27017/iNoteBookDB"

const connectToMongo = async() => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to Mongo Succesfully");
    } catch (err) {
        console.error("Error connecting to mongo", err);
    }
}

module.exports = connectToMongo;
