const profileModel = require('../models/profileSchema');
const { MessageEmbed } = require('discord.js');
const { db } = require('../models/profileSchema');
require('dotenv').config();

// TODO:
// Make it so it only displays users on your server.
module.exports = {
    name: "pk",
    aliases: ['pk', 'pker', 'pkers'],
    cooldown: 10,
    permissions: [],
    description: "Check the leaderboard!",
    async execute(messageCreate, args, cmd, client, profileData) {

        // recieve the top 5 users
        try {
            db.collection("gpmodels").aggregate([
                { $project: 
                    {
                        'name' : '$name',
                        'gp'  :  '$gp'
                     }
                },
                { $match: { 'gp' : {$gt: 1}}},
                { $sort: { 'gp' : -1 } }]).toArray(function(err, result) {

                if(err) { 
                    console.log(err)
                }
                
                // If there is not 5 users in the database do not display a leaderboard. 
                
    
                // make embed, then loop through array and add field with
                const newEmbed = new MessageEmbed()
                    .setColor(0x00FFFF)
                    .setDescription("Leaderboard - Pker gold earned")
                    .setTimestamp()
                    .setFooter({text: 'List of GP earned during PK'})
                const size = Array.from(result).length;
                for(i = 0; i < size; i++) {
                    newEmbed.addFields(
                        { name: `${i+1}) ${Array.from(result)[i].name}`, value: `${Array.from(result)[i].gp.toLocaleString("en-US")} GP`},
                    )
                }
                
            
                messageCreate.channel.send({embeds: [newEmbed]});
                
                })
            } catch(err) {
                console.log(err);
            }
    }
}