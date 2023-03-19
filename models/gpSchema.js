const mongoose = require('mongoose');

const gpSchema = new mongoose.Schema({
    name: { type: String },
    gp: { type: Number }
})

const gpmodel = mongoose.model('GPModels', gpSchema)

module.exports = gpmodel;