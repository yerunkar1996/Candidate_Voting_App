const mongoose = require('mongoose')

const UserModel = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    Role:String,
    UserName:String
})

module.exports = mongoose.model('users', UserModel)
