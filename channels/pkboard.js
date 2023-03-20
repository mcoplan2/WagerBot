const { MessageEmbed, client } = require('discord.js');
const messageCreate = require('../events/guild/messageCreate');
const { db } = require('../models/profileSchema');
require('dotenv').config();

// TODO:
// Make it so it only displays users on your server.

async function updateLeaderboard(channel) {

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
            { $sort: { 'gp' : -1 } }]).toArray(async function(err, result) {

            if(err) { 
                console.log(err)
        }
        
        // If there is not 5 users in the database do not display a leaderboard. 
        

        // make embed, then loop through array and add field with
        // const newEmbed = new MessageEmbed()
        //     .setColor(0x00FFFF)
        //     .setDescription("Leaderboard - Pker gold earned")
        //     .setTimestamp()
        //     .setFooter({text: 'List of GP earned during PK'})
        // const size = Array.from(result).length;
        // let sum = 0;
        // for(i = 0; i < size; i++) {
        //     sum += Array.from(result)[i].gp;
        //     newEmbed.addFields(
        //         { name: `${i+1}) ${Array.from(result)[i].name}`, value: `${Array.from(result)[i].gp.toLocaleString("en-US")} GP`},
        //     )
        // }
        // newEmbed.addFields(
        //     { name: 'Total gold earned: ' , value: `${sum.toLocaleString("en-US")} GP`},
        // )

        
        await channel.send("*pk");

        })
    } catch(err) {
        console.log(err);
    }
}
module.exports = {updateLeaderboard}