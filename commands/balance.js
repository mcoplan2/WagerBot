module.exports = {
    //TODO: 8ball ? Ask bot question and bet against server as a group?
    //TODO: Freeforall ? Create a bet with a question and reacting to emote YES/NO Places bet
    //TODO Deathmatch ? 1v1 against someone
    name: "balance",
    aliases: ['bal', 'total', 'bln'],
    permissions: [],
    description: "Check your balance",
    async execute(messageCreate, args, cmd, client, profileData) {
        messageCreate.channel.send(`Your have ${profileData.tokens} tokens, and ${profileData.bank} in your bank`);
    },
};