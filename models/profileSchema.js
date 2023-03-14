const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userID: { type: String, require: true, unique: true },
    serverID: { type: String, require: true },
    name: { type: String },
    tokens: { type: Number, default: 200 },
    bank: { type: Number },
    gp: { type: Number }

})

const model = mongoose.model('ProfileModels', profileSchema)

module.exports = model;