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

async function findGP(name) {
    await gpModel.findOne({name: new RegExp('^'+name+'$', "i")}, function(err, doc) {
      });
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

async function findPVM(name) {
    await pvmmodel.findOne({name}, function(err, doc) {
      });
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
module.exports = {updateTokens, updateTokensAndBank, updateGP, findGP, createGP, createPVM, findPVM, updatePVM};