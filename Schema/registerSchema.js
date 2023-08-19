const mongoose = require('mongoose')

const registerModel = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    Username: String,
    Password: String,    
    Email: String,    
    Mobile: Number,
    Status: Number
})

module.exports = mongoose.model('voterregisters', registerModel)
