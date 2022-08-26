const profileModel = require('../models/profileSchema');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const { updateTokens } = require('../repository/token_repository');
const { random } = require('lodash');
require('dotenv').config();

module.exports = {
    //TODO Deathmatch ? 1v1 against someone
    name: "beg",
    aliases: [],
    permissions: [],
    cooldown: 86400,
    description: "Beg for more tokens",
    async execute(messageCreate, args, cmd, client, profileData) {

        const role_name = process.env.ROLE_NAME;
        const prefix = process.env.PREFIX;

        const eligibleRole = messageCreate.guild.roles.cache.find(role => role.name === role_name);

        // check if the user has the role before allowing them to use the command
        if(!messageCreate.member.roles.cache.has(eligibleRole.id)) {
            return messageCreate.channel.send(`You need to ${prefix}register before using this bot.`);
        }
        const randomNumber = Math.floor(Math.random() * 300) + 1;
        if(randomNumber < 50){
            randomNumber = randomNumber + 52;
        }

        await updateTokens(messageCreate.author.id, randomNumber);

        return messageCreate.channel.send({embeds: [new MessageEmbed()
                            .setColor(0x00FFFF)
                            .setAuthor({ name: `${messageCreate.author.username}`, 
                                        iconURL: `${messageCreate.author.displayAvatarURL({dynamic:true})}` })
                            .setDescription(`${messageCreate.author.username}, you recieved ${randomNumber} **tokens**!`)
                            .setTimestamp()]});
    }
};