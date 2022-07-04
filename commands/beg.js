const profileModel = require('../models/profileSchema');
const { MessageEmbed, MessageAttachment } = require('discord.js');
require('dotenv').config();

module.exports = {
    //TODO Deathmatch ? 1v1 against someone
    name: "beg",
    aliases: [],
    permissions: [],
    cooldown: 856400,
    description: "Beg for more tokens",
    async execute(messageCreate, args, cmd, client, profileData) {

        const role_name = process.env.ROLE_NAME;

        const eligibleRole = messageCreate.guild.roles.cache.find(role => role.name === role_name);

        // check if the user has the role before allowing them to use the command
        if(messageCreate.member.roles.cache.has(eligibleRole.id)) {

            const randomNumber = Math.floor(Math.random() * 300) + 1
            const response = await profileModel.findOneAndUpdate({
                userID: messageCreate.author.id,
            }, {
                $inc: {
                    tokens: randomNumber,
                },
            });

            const newEmbed = new MessageEmbed()
                .setColor(0x00FFFF)
                .setAuthor({ name: `${messageCreate.author.username}`, iconURL: `${messageCreate.author.displayAvatarURL({dynamic:true})}` })
                .setDescription(`${messageCreate.author.username}, you recieved ${randomNumber} **tokens**!`)
                .setTimestamp()

            return messageCreate.channel.send({embeds: [newEmbed]});
        } else {
            messageCreate.channel.send("You need to !register before using this bot.")
        }
    }
};