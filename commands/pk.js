const profileModel = require('../models/profileSchema');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const { db } = require('../models/profileSchema');
const nodeHtmlToImage = require('node-html-to-image')
const { createCanvas, loadImage } = require('canvas');
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
                { $sort: { 'gp' : -1 } }]).toArray(async function(err, result) {

                if(err) { 
                    console.log(err)
                }
                
                // If there is not 5 users in the database do not display a leaderboard. 
                

                // Create the HTML table using the leaderboard data
                let tableHtml = '<table><thead><tr><th>Rank</th><th>Name</th><th>GP</th></tr></thead><tbody>';
                result.forEach((user, index) => {
                tableHtml += `<tr><td>${index + 1}</td><td>${user.name}</td><td>${user.gp.toLocaleString("en-US")}</td></tr>`;
                });
                tableHtml += '</tbody></table>';
                

                // Set up the HTML-to-Image conversion options
                const options = { 
                    quality: 1,
                    type: 'png',
                    puppeteerArgs: { args: ['--no-sandbox'] },
                    encoding: 'buffer'
                  };
                  
                  // Use node-html-to-image to convert the HTML table to a PNG image buffer
                  nodeHtmlToImage({ html: tableHtml, puppeteerArgs: options.puppeteerArgs }, options)
                    .then(async (buffer) => {
                      // Load the image data into a canvas
                      const img = await loadImage(buffer);
                      const canvas = createCanvas(img.width, img.height);
                      const ctx = canvas.getContext('2d');
                      ctx.drawImage(img, 0, 0, img.width, img.height);

                    // Create a Discord message attachment with the canvas image data
                    const attachment = new MessageAttachment(canvas.toBuffer(), 'leaderboard.png');

                    // Create a Discord embed with the leaderboard image
                    const embed = {
                    title: 'Leaderboard',
                    image: {
                        url: `attachment://${attachment.name}`,
                    },
                    };

                    // Send the embed with the leaderboard image to the Discord channel
                    messageCreate.channel.send({ embeds: [embed], files: [attachment] });
                })
                .catch((error) => {
                    console.error('Error creating leaderboard image:', error);
                });




    
                // make embed, then loop through array and add field with
                // const newEmbed = new MessageEmbed()
                //     .setColor(0x00FFFF)
                //     .setDescription("Leaderboard - Pker gold earned")
                //     .addFields({ name: '\u200B', value: '\u200B'})
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
                //     { name: '\u200b' , value: '```diff\n------------------------------------------------------------\n```'},
                // )

                // newEmbed.addFields(
                //     { name: 'Total gold earned: ' , value: `${sum.toLocaleString("en-US")} GP`},
                // )
                // newEmbed.addFields(
                //     { name: '\u200B' , value: `\u200B`},
                // )
                
            
                //messageCreate.channel.send({embeds: [embed]});
                
                })
            } catch(err) {
                console.log(err);
            }
    }
}