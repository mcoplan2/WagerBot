const profileModel = require('../models/profileSchema');
const gpModel = require('../models/gpSchema');
const pvmmodel = require('../models/pvmSchema');

async function updateTokens(userid, tokenAmount) {
    await profileModel.findOneAndUpdate({
        userID: userid,
    }, {
        $inc: {
            tokens: tokenAmount
        },
    });
}

async function updateTokensAndBank(userid, tokenAmount, bankAmount) {
    await profileModel.findOneAndUpdate({
        userID: userid,
    }, {
        $inc: {
            tokens: tokenAmount,
            bank: bankAmount,
        },
    });
}

async function createGP(name, gp) {
    await gpModel.insertMany({
        name: name,
        gp: gp
    })

}

async function updateGP(name, gp) {
    await gpModel.findOneAndUpdate({
        name: name,
    }, {
        $inc: {
            gp: gp
        },
    });
}

async function createPVM(name, gp) {
    await pvmmodel.insertMany({
        name: name,
        gp: gp
    })

}

async function updatePVM(name, gp) {
    await pvmmodel.findOneAndUpdate({
        name: name,
    }, {
        $inc: {
            gp: gp
        },
    });
}
module.exports = {updateTokens, updateTokensAndBank, updateGP, createGP, createPVM, updatePVM};