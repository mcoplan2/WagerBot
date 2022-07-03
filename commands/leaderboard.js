const profileModel = require('../models/profileSchema');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const { db } = require('../models/profileSchema');



module.exports = {
    //TODO Deathmatch ? 1v1 against someone
    // TODO LEADERBOARD
    name: "leaderboard",
    aliases: ['ladder', 'top', 'lb'],
    cooldown: 10,
    permissions: [],
    description: "Check the leaderboard",
    async execute(messageCreate, args, cmd, client, profileData) {

        // recieve the top 5 users
        try {
            db.collection("profilemodels").find().sort({tokens: 1}).limit(5).toArray(function(err, result) {
                if(err) { 
                    console.log(err)
                }
                // 0 is #5, 4 is #1
                // user objects
                let number5 = messageCreate.guild.members.cache.get(Array.from(result)[0].userID)
                let number4 = messageCreate.guild.members.cache.get(Array.from(result)[1].userID)
                let number3 = messageCreate.guild.members.cache.get(Array.from(result)[2].userID)
                let number2 = messageCreate.guild.members.cache.get(Array.from(result)[3].userID)
                let number1 = messageCreate.guild.members.cache.get(Array.from(result)[4].userID)

                // adding the bank and tokens for a total
                let token5 = Array.from(result)[0].tokens + Array.from(result)[0].bank;
                let token4 = Array.from(result)[1].tokens + Array.from(result)[1].bank;
                let token3 = Array.from(result)[2].tokens + Array.from(result)[2].bank;
                let token2 = Array.from(result)[3].tokens + Array.from(result)[3].bank;
                let token1 = Array.from(result)[4].tokens + Array.from(result)[4].bank;
                

                const newEmbed = new MessageEmbed()
                .setColor(0x00FFFF)
                .setDescription("Leaderboard - Top 5")
                .addFields(
                    { name: `1) ${number1.user.username}`, value: `Total: ${token1}`},
                    { name: `2) ${number2.user.username}`, value: `Total: ${token2}`},
                    { name: `1) ${number3.user.username}`, value: `Total: ${token3}`},
                    { name: `2) ${number4.user.username}`, value: `Total: ${token4}`},
                    { name: `1) ${number5.user.username}`, value: `Total: ${token5}`},
                )
                .setTimestamp()
                .setFooter({text: "***Includes tokens and bank together***"})


                messageCreate.channel.send({embeds: [newEmbed]});
           })
        } catch(err) {
            console.log(err);
        }
        

    }
}