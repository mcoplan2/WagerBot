const { MessageEmbed, MessageAttachment } = require('discord.js');
require('dotenv').config();

module.exports = {
    //TODO Deathmatch ? 1v1 against someone
    // TODO LEADERBOARD
    name: "balance",
    aliases: ['bal', 'total', 'bln'],
    cooldown: 10,
    permissions: [],
    description: "Check your balance",
    async execute(messageCreate, args, cmd, client, profileData) {

        const role_name = process.env.ROLE_NAME;
        const prefix = process.env.PREFIX;

        const eligibleRole = messageCreate.guild.roles.cache.find(role => role.name === role_name);

        // check if the user has the role before allowing them to use the command
        if(messageCreate.member.roles.cache.has(eligibleRole.id)) {

            const newEmbed = new MessageEmbed()
                .setColor(0x00FFFF)
                .setAuthor({ name: `${messageCreate.author.username}'s Balance`, iconURL: `${messageCreate.author.displayAvatarURL({dynamic:true})}` })
                .addFields(
                    { name: 'Tokens', value: `${profileData.tokens}`, inline: true },
                    { name: 'Bank', value: `${profileData.bank}` , inline: true }
                )
                .setTimestamp()

            messageCreate.channel.send({embeds: [newEmbed]});
        } else {
            messageCreate.channel.send(`You need to ${prefix}register before using this bot.`);
        }
    },
};