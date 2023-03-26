const { MessageAttachment } = require('discord.js');
const { db } = require('../models/profileSchema.js');
const nodeHtmlToImage = require('node-html-to-image');
const { createCanvas, loadImage, setTransform } = require('canvas');
const dotenv = require('dotenv');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const Pvmleaderboard = require('../components/pvmleaderboard-transpiled.js');
const puppeteer = require('puppeteer');




// TODO:
// Make it so it only displays users on your server.

async function updatePVMLeaderboard(channel, client) {

    // recieve the top 5 users
    try {
        db.collection("pvmmodels").aggregate([
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
        

        const leaderboardHtml = ReactDOMServer.renderToString(<Pvmleaderboard players={result} />);

        // Set up the HTML-to-Image conversion options
        const options = {
            quality: 100,
            type: 'jpeg',
            puppeteerArgs: { args: ['--no-sandbox', '--disable-dev-shm-usage'],  },
            encoding: 'buffer',
            scale: 1
            };
            
            // Use node-html-to-image to convert the HTML table to a PNG image buffer
            await nodeHtmlToImage({ html: leaderboardHtml, puppeteerArgs: options.puppeteerArgs }, options)
            .then(async (buffer) => {
                // Load the image data into a canvas
                const img = await loadImage(buffer);
            const canvas = createCanvas(img.width*2, img.height*2); // double the size of the canvas
            const ctx = canvas.getContext('2d');
            
            ctx.scale(2, 2)
            var scale = Math.max(ctx.canvas.width / img.width, ctx.canvas.height / img.height);
            var x = (ctx.canvas.width - (img.width * scale) ) / 2;
            var y = (ctx.canvas.height - (img.height * scale) ) / 2;
            ctx.setTransform(scale, 0, 0, scale, x, y);

            ctx.drawImage(img, 0, 0, img.width, img.height); // draw the image at double the size

            // Create a Discord message attachment with the canvas image data
            const attachment = new MessageAttachment(canvas.toBuffer(), 'leaderboard2.png');

            // Send the embed with the leaderboard image to the Discord channel
            const messages = await channel.messages.fetch({limit:100})
            channel.bulkDelete(messages)
            await channel.send({ files: [attachment] });
        })
        .catch((error) => {
            console.error('Error creating leaderboard image:', error);
        });

    
        })
    } catch(err) {
        console.log(err);
    }
}
module.exports = {updatePVMLeaderboard}