require('dotenv').config();
const { MessageEmbed, MessageAttachment } = require('discord.js');

module.exports = {
    name: "help",
    aliases: ["commands"],
    permissions: [],
    cooldown: 60,
    description: "displays a list of commands for the user",
    async execute(messageCreate, args, cmd, client, profileData) {

        const prefix = process.env.PREFIX;

        const newEmbed = new MessageEmbed()
                .setColor(0x00FFFF)
                .setDescription("List of commands you can use")
                .addFields(
                    { name: `${prefix}register`, value: `Allows the user to earn tokens and participate in events`},
                    { name: `${prefix}balance`, value: `Displays the current balance of tokens for the user`},
                    { name: `${prefix}deposit [value]`, value: `Allows the user to deposit an amount into their bank`},
                    { name: `${prefix}withdraw [value]`, value: `Allows the user to withdraw an amount from their bank`},
                    { name: `${prefix}leaderboard`, value: `Displays the users with the most tokens`},
                    { name: `${prefix}beg`, value: `Daily cooldown the user can use to generate a random number of tokens`},
                    { name: `${prefix}ffa [Phrase a bet]`, value: `Free for all event, choose yes or no`},
                )

        messageCreate.channel.send({embeds: [newEmbed]});
    },
}