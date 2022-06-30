module.exports = {
    name: "balance",
    permissions: [],
    description: "Check your balance",
    execute(messageCreate, args, client, profileData) {
        messageCreate.channel.send(`Your wallet bal is ${profileData.tokens}, your banks bal is ${profileData.bank}`);
    },
};