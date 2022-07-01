const { MessageEmbed, MessageAttachment } = require('discord.js');
module.exports = {
    name: 'register',
    description: 'register to database command',
    async execute(messageCreate, client, args, profileData) {
        const file = new MessageAttachment("./index.jpg")
        const newEmbed = new MessageEmbed()
            .setColor(0x00FFFF)
            .setTitle(`${messageCreate.author.username} is Verified`)
            .setDescription('You are now eligible to earn tokens on this server!')
            .setTimestamp()
            .setThumbnail('attachment://index.jpg')

        messageCreate.channel.send({embeds: [newEmbed], files: [file]});
    }
}