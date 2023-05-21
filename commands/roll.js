const profileModel = require('../models/profileSchema');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const { updateTokens } = require('../repository/token_repository');
require('dotenv').config();

module.exports = {
    //TODO Deathmatch ? 1v1 against someone
    name: "roll",
    aliases: [],
    permissions: [],
    cooldown: 20,
    description: "boardroll",
    async execute(messageCreate, args, cmd, client, profileData) {

        let randomNumber = Math.random() * 100;

if (randomNumber < 45) {
// 45% chance for number 1
randomNumber = 1;
} else if (randomNumber < 80) {
// 35% chance for number 2
randomNumber = 2;
} else {
// 20% chance for number 3
randomNumber = 3;
}

        return messageCreate.channel.send({embeds: [new MessageEmbed()
                            .setColor(0x00FFFF)
                            .setAuthor({ name: `${messageCreate.author.username}`, 
                                        iconURL: `${messageCreate.author.displayAvatarURL({dynamic:true})}` })
                            .setDescription(`${messageCreate.author.username}, you have rolled a ${randomNumber}!`)
                            .setTimestamp()]});
    }
};