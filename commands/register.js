const { MessageEmbed, MessageAttachment } = require('discord.js');
require('dotenv').config();

module.exports = {
    name: 'register',
    cooldown: 30,
    description: 'allows user to be eligible to earn tokens and participate in events',
    async execute(messageCreate) {
        const file = new MessageAttachment("./index.jpg")

        const role_name = process.env.ROLE_NAME;
        const eligibleRole = messageCreate.guild.roles.cache.find(role => role.name === role_name);

        await messageCreate.member.roles.add(eligibleRole);

        const displayName = messageCreate.member ? messageCreate.member.displayName : messageCreate.author.username;
        const newEmbed = new MessageEmbed()
            .setColor(0x00FFFF)
            .setAuthor({ name: `${displayName} is verified`, iconURL: `${messageCreate.author.displayAvatarURL({dynamic:true})}` })
            .setDescription('You are now eligible to earn tokens on this server!')
            .setTimestamp()
            .setThumbnail('attachment://index.jpg')

        messageCreate.channel.send({embeds: [newEmbed], files: [file]});
    }
}