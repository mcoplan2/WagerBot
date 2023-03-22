
const { Client, Intents, Collection, DiscordAPIError, MessageCollector } = require('discord.js');
require('dotenv').config();
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
const mongoose = require('mongoose');
const { updateLeaderboard } = require('./channels/pkboard-transpiled.js');
const { createGP, createPVM, updatePVM } = require('./repository/token_repository');
const { findGP } = require('./repository/token_repository');
const { updateGP } = require('./repository/token_repository');
const { db } = require('./models/profileSchema');
const { getDifference, sleep } = require('./utils/functions');
const { updatePVMLeaderboard } = require('./channels/pvmboard.js');

require("@babel/register")({
    presets: ["@babel/preset-react"],
  });

client.commands = new Collection();
client.events = new Collection();

['command_handler', 'event_handler'].forEach(handler => {
    require(`./handlers/${handler}`)(client)
})

// connecting to DB
mongoose.connect(process.env.MONGODB_SRV, {
}).then( () => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err)
});

// Input Discord Token
client.login(process.env.DISCORD_TOKEN);

let pkers = new Map;
let pvmers = new Map;
// Listen for messages from webhook
client.on('messageCreate', message => {
    if(message.content.toLowerCase() === '?listen') {

        message.channel.send('bot is collecting messages now');
        let filter = m => !m.author.bot
        let collecter = new MessageCollector(message.channel, filter);
        let sum = 0;
        let sum2 = 0;
        collecter.on('collect', (message, col) => {

            // only collect messages that contain 'defeated'
            if (message.content.includes("defeated")) {
                console.log("Collected message: " +message.content);

                // parse the string into a pkerName(playerName) and pkerCoins(GP);
                // example string: ff3r has defeated Oculist and received (840,570 coins) worth of loot!
                // pkerName(ff3r), pkerCoins(840570)
                const pkerName = message.content.split(' has')[0];
                const pkerCoins = parseInt(message.content.substring(message.content.indexOf('(')+1).split(' ')[0].replaceAll(',',""));
                console.log("Collected name:" +pkerName);
                console.log("Collected amount:" +pkerCoins);
                console.log(pkers);
                
                // if the player is not already in the map, add to the map
                if(pkers.get(pkerName) == undefined) {
                    pkers.set(pkerName, pkerCoins);
                } else {
                    // if the player is in the map, increment their coins
                    pkers.set(pkerName, (pkers.get(pkerName)+pkerCoins));
                }
                
                console.log(pkers.get(pkerName));
            }

            if ((message.content.includes("drop")) || (message.content.includes("special loot"))) {

                console.log("Collected message: " +message.content);

                // parse the string into a pkerName(playerName) and pkerCoins(GP);
                // example string: ff3r has defeated Oculist and received (840,570 coins) worth of loot!
                // pkerName(ff3r), pkerCoins(840570)
                const pvmerName = message.content.split(' received')[0];
                const pvmerCoins = parseInt(message.content.substring(message.content.indexOf('(')+1).split(' ')[0].replaceAll(',',""));
                console.log("Collected name:" + pvmerName);
                console.log("Collected amount:" + pvmerCoins);
                console.log(pvmers);
                
                // if the player is not already in the map, add to the map
                if(pvmers.get(pvmerName) == undefined) {
                    pvmers.set(pvmerName, pvmerCoins);
                } else {
                    // if the player is in the map, increment their coins
                    pvmers.set(pvmerName, (pvmers.get(pvmerName)+pvmerCoins));
                }
                
                console.log(pvmers.get(pvmerName));

            }

            // use ?stop when you want to stop collecting messages and add to the database
            if(message.content.toLocaleLowerCase() === "?stop") {
                collecter.stop();
            }
            
        // Store information in Database
        });
        collecter.on('end', async collected => {
            const pkReportCardChannelId = "1085620863086379099";
            const pkReportCardChannel = client.channels.cache.get(pkReportCardChannelId);

            const pvmerReportChannelId = "1087909950736576643";
            const pvmerReportChannel = client.channels.cache.get(pvmerReportChannelId);
            
            if(pkers.size > 0) {
                pkReportCardChannel.send('Adding up all the kills for ' + new Date().toDateString() +":" );
            }
            if(pvmers.size > 0) {
                pvmerReportChannel.send('Adding up all the drops recieved on: ' + new Date().toDateString() +":" );

            }
            // sort by gold value in ascending
            const pkersSorted = new Map([...pkers.entries()].sort((a, b) => b[1] - a[1]))
            const pvmersSorted = new Map([...pvmers.entries()].sort((a, b) => b[1] - a[1]))

            let i = 1;
            let j = 1;
            pkersSorted.forEach(async function(value, key){
                if (value>0){
                    console.log(value);
                    //make this output top GP, lowest, list everyone, total all loot
                    sum += value;
                    if (sum > 0) {
                        pkReportCardChannel.send(`${i}`+") "+key +": "+ value.toLocaleString("en-US") +" GP")
                    }
                    i = i+1;
                    // if the user is not in the database create a new document 
                    // else update the document
                    const query = {name: key};
                    const gpUsers = db.collection("gpmodels");
                    const gpUser = await gpUsers.findOne(query);
                    console.log(gpUser);
                    if (gpUser == null) {
                        await createGP(key, value)
                    } else {
                        await updateGP(key, value);
                    }
                }
            })
            

                pvmersSorted.forEach(async function(value, key){
                    if (value>0){
                        console.log(value);
                        //make this output top GP, lowest, list everyone, total all loot
                        sum2 += value;
                        if (sum2 > 0) {
                            pvmerReportChannel.send(`${j}`+") "+key +": "+ value.toLocaleString("en-US") +" GP")
                        }
                        j = j+1;
                        // if the user is not in the database create a new document 
                        // else update the document
                        const query = {name: key};
                        const pvmUsers = db.collection("pvmmodels");
                        const pvmUser = await pvmUsers.findOne(query);
                        console.log(pvmUser);
                        if (pvmUser == null) {
                            await createPVM(key, value)
                        } else {
                            await updatePVM(key, value);
                        }
                    }
            })
            if (pkersSorted.size > 0) {
                pkReportCardChannel.send("Total Gold Earned: "+sum.toLocaleString("en-US")+" GP");
            }
            
            if (pvmersSorted.size > 0) {
                pvmerReportChannel.send("Total Gold Earned: "+sum2.toLocaleString("en-US")+" GP")
            }
            console.log("Messages " + collected.size);
            const leaderboardChannelId = '1085554952874774659';
            const leaderboardChannel = client.channels.cache.get(leaderboardChannelId);
            const leaderboardPVMChannelId = '1087909911763107840';
            const leaderboardPVMChannel = client.channels.cache.get(leaderboardPVMChannelId);
            // give a chance for the database to update before displaying new leaderboard
            await sleep(120000)
            await updateLeaderboard(leaderboardChannel, client);
            await updatePVMLeaderboard(leaderboardPVMChannel, client);
            pkers.clear();
            pvmers.clear();
        });
    }

});