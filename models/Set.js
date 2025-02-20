const mongoose = require('mongoose');

const setSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    uname:{
        type:String,
        unique:true
    },
    address:{
        houseNo:{
            type:String
        },
        street:{
            type:String
        },
        landmark:{
            type:String
        },
        city:{
            type:String
        },
        state:{
            type:String
        },
        pincode:{
            type:String
        },
        mobile:{
            type:String
        }
    },
    paid:{
        type:Boolean,
        default:false
    },
    step: { type: Number, enum: [1,2,3,4] },
    card: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Card', 
    },
    web: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Web', 
    },
    
    
});


module.exports = mongoose.model('Set', setSchema);
