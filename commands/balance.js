module.exports = {
    name: "balance",
    permissions: [],
    description: "Check your balance",
    async execute(messageCreate, args, client, profileData) {
        messageCreate.channel.send(`Your have ${profileData.tokens} tokens, and ${profileData.bank} in your bank`);
    },
};