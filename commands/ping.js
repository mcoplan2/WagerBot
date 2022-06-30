module.exports = {
    name: 'ping',
    description: 'ping command',
    async execute(messageCreate, client, args, profileData) {
        messageCreate.channel.send('!pong');
    }
}