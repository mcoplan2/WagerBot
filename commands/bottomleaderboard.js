const profileModel = require('../models/profileSchema');
const { MessageEmbed } = require('discord.js');
const { db } = require('../models/profileSchema');
require('dotenv').config();

// TODO:
// Make it so it only displays users on your server.
module.exports = {
    name: "bottomleaderboard2",
    aliases: ['botladder2', 'bot2', 'bottom2'],
    cooldown: 10,
    permissions: [],
    description: "Check who are at the bottom of the leaderboard!",
    async execute(messageCreate, args, cmd, client, profileData) {

        const role_name = process.env.ROLE_NAME;
        const prefix = process.env.PREFIX;
        const server_id = process.env.SERVER_ID;

        const eligibleRole = messageCreate.guild.roles.cache.find(role => role.name === role_name);
        // check if the user has the role before allowing them to use the command
        if(messageCreate.member.roles.cache.has(eligibleRole.id) && messageCreate.guild.id == server_id) {

        // recieve the top 5 users
        try {
            db.collection("profilemodels").aggregate([
                { $project: 
                    {
                        'userID' : '$userID',
                        'serverID' : `${server_id}`,
                        'tokens' : '$tokens',
                        'bank' : '$bank',
                        'total' : { '$add' : ['$tokens' , '$bank' ]}
                     }
                },
                { $sort: { 'total' : 1 } },
                { $limit: 5}]).toArray(function(err, result) {

                if(err) { 
                    console.log(err)
                }
                
                // If there is not 5 users in the database do not display a leaderboard. 
                const size = Array.from(result).length;
                if (size >= 5) {

                    // 0 is #5, 4 is #1
                    // user objects
                    let number1 = messageCreate.guild.members.cache.get(Array.from(result)[0].userID)
                    let number2 = messageCreate.guild.members.cache.get(Array.from(result)[1].userID)
                    let number3 = messageCreate.guild.members.cache.get(Array.from(result)[2].userID)
                    let number4 = messageCreate.guild.members.cache.get(Array.from(result)[3].userID)
                    let number5 = messageCreate.guild.members.cache.get(Array.from(result)[4].userID)

                    // adding the bank and tokens for a total
                    let token1 = Array.from(result)[0].tokens + Array.from(result)[0].bank;
                    let token2 = Array.from(result)[1].tokens + Array.from(result)[1].bank;
                    let token3 = Array.from(result)[2].tokens + Array.from(result)[2].bank;
                    let token4 = Array.from(result)[3].tokens + Array.from(result)[3].bank;
                    let token5 = Array.from(result)[4].tokens + Array.from(result)[4].bank;
                
                    // make embed, then loop through array and add field with
                    const newEmbed = new MessageEmbed()
                    .setColor(0x00FFFF)
                    .setDescription("Leaderboard - Bottom 5")
                    .addFields(
                        { name: `1) ${number1.user.username}`, value: `Total: ${token1}`},
                        { name: `2) ${number2.user.username}`, value: `Total: ${token2}`},
                        { name: `3) ${number3.user.username}`, value: `Total: ${token3}`},
                        { name: `4) ${number4.user.username}`, value: `Total: ${token4}`},
                        { name: `5) ${number5.user.username}`, value: `Total: ${token5}`},
                    )
                    .setTimestamp()
                    .setFooter({text: 'tokens and bank amounts are added'})


                    messageCreate.channel.send({embeds: [newEmbed]});
                } else {
                    messageCreate.channel.send("You do not have 5 eligible users for the leaderboard.")
                }
                })
            } catch(err) {
                console.log(err);
            }
        
        } else {
            messageCreate.channel.send(`You need to ${prefix}register before using this bot.`);
        }
    }
}