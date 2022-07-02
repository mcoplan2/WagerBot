const { MessageEmbed, MessageAttachment } = require('discord.js');
module.exports = {
    //TODO: 8ball ? Ask bot question and bet against server as a group?
    //TODO: Freeforall ? Create a bet with a question and reacting to emote YES/NO Places bet
    //TODO Deathmatch ? 1v1 against someone
    name: "balance",
    aliases: ['bal', 'total', 'bln'],
    cooldown: 30,
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