module.exports = {
    name: 'ping',
    description: 'ping command',
    async execute(client, messageCreate, args) {
        messageCreate.channel.send('!pong');
    }
}