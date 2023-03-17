
const { Client, Intents, Collection, DiscordAPIError, MessageCollector } = require('discord.js');
require('dotenv').config();
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
const mongoose = require('mongoose');
const { updateLeaderboard } = require('./channels/pkboard');
const { createGP } = require('./repository/token_repository');
const { findGP } = require('./repository/token_repository');
const { updateGP } = require('./repository/token_repository');

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
// Listen for messages from webhook
client.on('messageCreate', message => {
    if(message.content.toLowerCase() === '?listen') {

        message.channel.send('bot is collecting messages now');
        let filter = m => !m.author.bot
        let collecter = new MessageCollector(message.channel, filter);
        let sum = 0;
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

            // use ?stop when you want to stop collecting messages and add to the database
            if(message.content.toLocaleLowerCase() === "?stop") {
                collecter.stop();
            }
            
        // Store information in Database
        });
        collecter.on('end', collected => {
            const pkReportCardChannelId = "1085620863086379099";
            const pkReportCardChannel = client.channels.cache.get(pkReportCardChannelId);
            
            pkReportCardChannel.send('Adding up all the kills for ' + new Date().toDateString() +":" );
            // sort by gold value in ascending
            const pkersSorted = new Map([...pkers.entries()].sort((a, b) => b[1] - a[1]))

            let i = 1;
            pkersSorted.forEach(async function(value, key){
                if (value>0){
                    console.log(value);
                    //make this output top GP, lowest, list everyone, total all loot
                    sum += value;
                    pkReportCardChannel.send(`${i}`+") "+key +": "+ value.toLocaleString("en-US") +" GP")
                    i = i+1;
                    // if the user is not in the database create a new document 
                    // else update the document
                    if (await findGP(key) == null) {
                        await createGP(key, value)
                    } else {
                        await updateGP(key, value);
                    }
                }
            })
            pkReportCardChannel.send("Total Gold Earned: "+sum.toLocaleString("en-US")+" GP");
            console.log("Messages " + collected.size);
            const leaderboardChannelId = '1085554952874774659';
            const leaderboardChannel = client.channels.cache.get(leaderboardChannelId);
            updateLeaderboard(leaderboardChannel);
            pkers.clear();
        });
    }

});