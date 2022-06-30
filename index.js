
const { Client, Intents, Collection } = require('discord.js');
require('dotenv').config();
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const mongoose = require('mongoose');

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