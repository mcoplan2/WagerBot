
const { Client, Intents, Collection, DiscordAPIError, MessageCollector } = require('discord.js');
require('dotenv').config();
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
const mongoose = require('mongoose');
const { updateLeaderboard } = require('./channels/pkboard');
const { updateGP } = require('./repository/token_repository');

client.commands = new Collection();
client.events = new Collection();

['command_handler', 'event_handler'].forEach(handler => {
    require(`./handlers/${handler}`)(client)
})

mongoose.connect(process.env.MONGODB_SRV, {
}).then( () => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err)
});

client.login(process.env.DISCORD_TOKEN);

client.on('messageCreate', message => {
    if(message.content.toLowerCase() === '?listen') {
        const pkers = new Map;
        pkers.set("schol", 0);
        pkers.set("ff3r", 0);
        pkers.set("E2P", 0);
        pkers.set("TurkeyMaster", 0);
        pkers.set("DEMUNLULLIO", 0)
        pkers.set("Xmas Bandit", 0)
        pkers.set("bighunterkid", 0)
        pkers.set("Dualerz", 0);
        pkers.set("Jay Are", 0);
        pkers.set("Huutista", 0);
        pkers.set("ChessyQ18", 0);
        pkers.set("I Love You", 0);
        pkers.set("Spear", 0);
        pkers.set("Flemingo", 0);
        pkers.set("LukaDONClC77", 0);
        pkers.set("Hell Nova", 0);
        pkers.set("Scotticon", 0);
        pkers.set("Kemp", 0);
        pkers.set("Roelol", 0);
        pkers.set("Just Darsh", 0);
        pkers.set("Packed", 0);
        pkers.set("Lil2", 0);
        message.channel.send('bot is collecting messages now');
        let filter = m => m.content.includes('defeated');
        let collecter = new MessageCollector(message.channel, m => m.content.includes('defeated'));
        collecter.on('collect', (message, col) => {
            console.log("Collected message: " +message.content);
            const name = message.content.split(' has')[0];
            console.log(name);
            const test = message.content.substring(message.content.indexOf('(')+1);
            const coins = test.split(' ')[0];
            const coinsd = parseInt(coins.replaceAll(',',""))
            console.log(coinsd)
            console.log(pkers);

            
            pkers.set(name, (pkers.get(name)+coinsd));
            console.log(pkers.get(name));

            if(message.content.toLocaleLowerCase() === "?stop") {
                collecter.stop();
            }
            //add everything
            // use ?stop to collect
            // print out the map and see values
            // if correct -> continue to database
            

            // use string commands to concat name and amount of pk
            // use a map to input their name with their amount and keep u pdating
            // at end of pk trip display totals and add to a database

            // if message.content=="?stop"
            // stop and collect messages
        });
        collecter.on('end', collected => {
            message.channel.send('bot is adding up all the kills');
            const pkersSorted = new Map([...pkers.entries()].sort((a, b) => b[1] - a[1]))
            console.log(pkersSorted);
            pkersSorted.forEach( async function(value, key){
                if (value>0){
                    console.log(value);
                    //make this output top GP, lowest, list everyone, total all loot
                    await message.channel.send(key +" : "+ value +" GP");
                    await updateGP(key, value);
                }
            })
            console.log("Messages " + collected.size);
            const channelId = '1085554952874774659';
            const channel = client.channels.cache.get(channelId);
            updateLeaderboard(channel);
        });
    }

});