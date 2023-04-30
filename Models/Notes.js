const mongoose = require('mongoose');

const notesSchema = mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    },
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    tag : {
        type : String,
        // required : true,
        default : "General"
    },
    date : {
        type : Date,
        required : true,
        default : Date.now
    }
});

module.exports = mongoose.model('notes', notesSchema);