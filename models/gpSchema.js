const mongoose = require('mongoose');

const gpSchema = new mongoose.Schema({
    name: { type: String },
    gp: { type: Number }
})

const model = mongoose.model('GPModels', gpSchema)

module.exports = model;