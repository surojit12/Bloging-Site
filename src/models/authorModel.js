const mongoose = require('mongoose');

const authorSchema = mongoose.Schema(
    { 
        fname : { 
                    type: String, 
                    required: true 
                }, 
        lname : { 
                    type: String, 
                    required: true 
                }, 
        title : { 
                    type: String, 
                    enum: ["Mr", "Mrs", "Miss"], 
                    required: true 
                }, 
        email : { 
                    type: String, 
                    required: true, unique: true,
                    lowercase : {require : true} 
                }, 
        password :  { 
                        type: String, 
                        required: true 
                    } 
    },{ timestamps : true }
);

module.exports = mongoose.model('author',authorSchema);