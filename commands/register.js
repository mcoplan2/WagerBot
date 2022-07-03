const { MessageEmbed, MessageAttachment } = require('discord.js');
module.exports = {
    name: 'register',
    cooldown: 30,
    description: 'allows user to be eligible to earn tokens and participate in events',
    async execute(messageCreate, client, args, profileData) {
        const file = new MessageAttachment("./index.jpg")
        const eligibleRole = messageCreate.guild.roles.cache.find(role => role.name === "Wager");

        await messageCreate.member.roles.add(eligibleRole);
        const newEmbed = new MessageEmbed()
            .setColor(0x00FFFF)
            .setAuthor({ name: `${messageCreate.author.username} is verified`, iconURL: `${messageCreate.author.displayAvatarURL({dynamic:true})}` })
            .setDescription('You are now eligible to earn tokens on this server!')
            .setTimestamp()
            .setThumbnail('attachment://index.jpg')

        messageCreate.channel.send({embeds: [newEmbed], files: [file]});
    }
}