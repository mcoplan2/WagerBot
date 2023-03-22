const mongoose = require('mongoose');

const pvmSchema = new mongoose.Schema({
    name: { type: String },
    gp: { type: Number }
})

const pvmmodel = mongoose.model('PVMModels', pvmSchema)

module.exports = pvmmodel;