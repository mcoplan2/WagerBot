const profileModel = require('../models/profileSchema');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const { updateTokens } = require('../repository/token_repository');
require('dotenv').config();

module.exports = {
    //TODO Deathmatch ? 1v1 against someone
    name: "roll",
    aliases: [],
    permissions: [],
    cooldown: 120,
    description: "boardroll",
    async execute(messageCreate, args, cmd, client, profileData) {

        let randomNumber = Math.floor(Math.random() * 4) + 1;

        return messageCreate.channel.send({embeds: [new MessageEmbed()
                            .setColor(0x00FFFF)
                            .setAuthor({ name: `${messageCreate.author.username}`, 
                                        iconURL: `${messageCreate.author.displayAvatarURL({dynamic:true})}` })
                            .setDescription(`${messageCreate.author.username}, you have rolled a ${randomNumber}!`)
                            .setTimestamp()]});
    }
};