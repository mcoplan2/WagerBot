const profileModel = require('../models/profileSchema');
const { MessageEmbed, MessageAttachment } = require('discord.js');

module.exports = {
    //TODO: 8ball ? Ask bot question and bet against server as a group?
    //TODO: Freeforall ? Create a bet with a question and reacting to emote YES/NO Places bet
    //TODO Deathmatch ? 1v1 against someone
    name: "beg",
    aliases: [],
    permissions: [],
    cooldown: 856400,
    description: "Beg for more tokens",
    async execute(messageCreate, args, cmd, client, profileData) {
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
    }
};