const { MessageEmbed, MessageAttachment } = require('discord.js');
module.exports = {
    //TODO Deathmatch ? 1v1 against someone
    name: "balance",
    aliases: ['bal', 'total', 'bln'],
    cooldown: 10,
    permissions: [],
    description: "Check your balance",
    async execute(messageCreate, args, cmd, client, profileData) {
        const newEmbed = new MessageEmbed()
            .setColor(0x00FFFF)
            .setAuthor({ name: `${messageCreate.author.username}'s Balance`, iconURL: `${messageCreate.author.displayAvatarURL({dynamic:true})}` })
            .addFields(
                { name: 'Tokens', value: `${profileData.tokens}`, inline: true },
                { name: 'Bank', value: `${profileData.bank}` , inline: true }
            )
            .setTimestamp()

        messageCreate.channel.send({embeds: [newEmbed]});
    },
};