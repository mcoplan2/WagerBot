
const { Client, Intents, Collection, DiscordAPIError, MessageCollector } = require('discord.js');
require('dotenv').config();
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
const mongoose = require('mongoose');
const { updateLeaderboard } = require('./channels/pkboard-transpiled.js');
const { createGP, createPVM, updatePVM, updateGP } = require('./repository/token_repository');
const { db } = require('./models/profileSchema');
const { getDifference, sleep } = require('./utils/functions');
const { updatePVMLeaderboard } = require('./channels/pvmboard.js');
const { rsPlayer } = require('./models/rsPlayer.js');

require('@babel/register');

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

const approvedMembers = ["Xmas Bandit", "E2P", "schol", "ff3r", "Dualerz", 
                        "Kemp", "TurkeyMaster", "LukaDONCIC77", "Scotticon",
                        "Flemingo", "Just Darsh", "DEMUNLULLIO", "Huutista", 
                        "bighunterkid", "Packed", "Moooosey", "Roelol", "gayp", 
                        "Epic Rafox", "Spear", "I Love You", "Jay Are"]

let pkers = new Map;
let pvmers = new Map;
let rsPkers = new Array();
let rsPvmers = new Array();



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
            if (message.content.includes("has defeated")) {
                console.log("Collected message: " +message.content);

                // parse the string into a pkerName(playerName) and pkerCoins(GP);
                // example string: ff3r has defeated Oculist and received (840,570 coins) worth of loot!
                // pkerName(ff3r), pkerCoins(840570)
                const pkerName = message.content.split(' has')[0];
                const pkerCoins = parseInt(message.content.substring(message.content.indexOf('(')+1).split(' ')[0].replaceAll(',',""));
                console.log("Collected name:" +pkerName);
                console.log("Collected amount:" +pkerCoins);
                console.log(pkers);
                const date = new Date();
                const pkerTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                
                // if the player is not already in the map, add to the map
                if(approvedMembers.includes(pkerName)) {
                    if (!rsPkers.some(o => o.name === pkerName)) {
                        let pkers2 = new rsPlayer;
                        pkers2.name = pkerName;
                        pkers2.gp = pkerCoins;
                        pkers2.time = pkerTime;
                        rsPkers.push(pkers2);
                    } else {
                        let existingPlayer = rsPkers.find(o => o.name === pkerName);
                        if (existingPlayer.time != pkerTime || existingPlayer.gp != pkerCoins) {
                            let pkers2 = new rsPlayer;
                            pkers2.name = pkerName;
                            pkers2.gp = pkerCoins;
                            pkers2.time = pkerTime
                            rsPkers.push(pkers2)
                        }
                    }
                }

                    console.log(rsPkers)
                    // if(pkers.get(pkerName) == undefined) {
                    //     pkers.set(pkerName, pkerCoins);
                    // } else {
                    //     // if the player is in the map, increment their coins
                    //     pkers.set(pkerName, (pkers.get(pkerName)+pkerCoins));
                    // }
                
                //console.log(pkers.get(pkerName));
            }

            if ((message.content.includes("received a drop:")) || (message.content.includes("special loot from a raid:"))) {

                console.log("Collected message: " +message.content);
                const date = new Date();
                const pvmerTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                // parse the string into a pkerName(playerName) and pkerCoins(GP);
                // example string: ff3r has defeated Oculist and received (840,570 coins) worth of loot!
                // pkerName(ff3r), pkerCoins(840570)
                const pvmerName = message.content.split(' received')[0];
                const pvmerCoins = parseInt(message.content.substring(message.content.indexOf('(')+1).split(' ')[0].replaceAll(',',""));
                console.log("Collected name:" + pvmerName);
                console.log("Collected amount:" + pvmerCoins);
                console.log(pvmers);
                
                // if the player is not already in the map, add to the map
                if(approvedMembers.includes(pvmerName)) {
                    if (!rsPvmers.some(o => o.name === pvmerName)) {
                        let pvmers2 = new rsPlayer;
                        pvmers2.name = pvmerName;
                        pvmers2.gp = pvmerCoins;
                        pvmers2.time = pvmerTime;
                        rsPvmers.push(pvmers2);
                    } else {
                        let existingPlayer = rsPvmers.find(o => o.name === pvmerName);
                        if (existingPlayer.time != pvmerTime || existingPlayer.gp != pvmerCoins) {
                            let pvmers2 = new rsPlayer;
                            pvmers2.name = pvmerName;
                            pvmers2.gp = pvmerCoins;
                            pvmers2.time = pvmerTime;
                            rsPvmers.push(pvmers2);
                        }
                    
                }
                
                console.log(rsPvmers)

                }
            }

            // use ?stop when you want to stop collecting messages and add to the database
            if(message.content.toLocaleLowerCase() === "?stop") {
                collecter.stop();
            }
            
        // Store information in Database

        });
        collecter.on('end', async collected => {
            for (const player of rsPkers) {
                if (pkers.has(player.name)) {
                  const currentGp = pkers.get(player.name);
                  pkers.set(player.name, currentGp + player.gp);
                } else {
                  pkers.set(player.name, player.gp);
                }
              }

              for (const player of rsPvmers) {
                if (pvmers.has(player.name)) {
                  const currentGp = pvmers.get(player.name);
                  pvmers.set(player.name, currentGp + player.gp);
                } else {
                  pvmers.set(player.name, player.gp);
                }
              }

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
            console.log(pkersSorted)

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
                    const query = { name: key.replace(/\s/g, "") };
                    const gpUsers = db.collection("gpmodels");
                    const gpUser = await gpUsers.findOne(query);
                    console.log("query:", query)
                    console.log("testing", gpUser);
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
                        const query = { name: key.replace(/\s/g, "") };
                        const pvmUsers = db.collection("pvmmodels");
                        const pvmUser = await pvmUsers.findOne(query);
                        console.log("query:", query)
                        console.log("Testing: ", pvmUser);
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