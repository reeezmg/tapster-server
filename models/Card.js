const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    templateName:{
        type: String,
    },
    front:{
        type: String,
    },
    back:{
        type: String,
    },
    textColor:{
        type: String,
    },
    bgColor:{
        type: String,
    },
    logo:{
        type: String,
    },
    companyName:{
        type: String,
    },
    name:{
        type: String,
    },
    subtitle:{
        type: String,
    }
});


module.exports = mongoose.model('Card', cardSchema);
