const profileModel = require('../models/profileSchema');

module.exports = {
    name: "deposit",
    aliases: ["dep"],
    permissions: [],
    cooldown: 60,
    description: "deposit tokens into your bank",
    async execute(messageCreate, args, cmd, client, profileData) {
        const amount = args[0];
        if (amount % 1 != 0 || amount <= 0) return messageCreate.channel.send("Deposit amount must be a whole number.");

        try {
            if (amount > profileData.tokens) return messageCreate.channel.send("Nice try! You don't have that amount of tokens to deposit.");
            await profileModel.findOneAndUpdate({
                userID: messageCreate.author.id,
                
            }, {
                $inc: {
                    tokens: -amount,
                    bank: amount,
                },
            });
            return messageCreate.channel.send(`You Deposited ${amount} of tokens into your bank.`)
        } catch(err){
            console.log(err)
        }
    }
}