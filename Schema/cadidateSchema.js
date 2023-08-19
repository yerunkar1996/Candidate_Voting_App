const mongoose = require('mongoose')

const candidateModel = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    Name: String,
    voteCount: Number
})

module.exports = mongoose.model('votercadidates', candidateModel)
