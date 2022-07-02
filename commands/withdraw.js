const profileModel = require('../models/profileSchema');

module.exports = {
    name: "withdraw",
    aliases: ["wd"],
    permissions: [],
    cooldown: 60,
    description: "withdraw tokens from your bank",
    async execute(messageCreate, args, cmd, client, profileData) {
        const amount = args[0];
        if (amount % 1 != 0 || amount <= 0) return messageCreate.channel.send("Withdraw amount must be a whole number.");

        try {
            if (amount > profileData.bank) return messageCreate.channel.send("Nice try! You don't have that amount of tokens in your bank.");
            await profileModel.findOneAndUpdate({
                userID: messageCreate.author.id,
                
            }, {
                $inc: {
                    tokens: amount,
                    bank: -amount,
                },
            });
            return messageCreate.channel.send(`You Withdraw ${amount} tokens out of your bank.`)
        } catch(err){
            console.log(err)
        }
    }
}