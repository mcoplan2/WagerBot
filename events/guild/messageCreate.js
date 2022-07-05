require('dotenv').config();
const { Collection } = require('discord.js');
const profileModel = require('../../models/profileSchema');

const cooldowns = new Map();

module.exports = async (client, messageCreate, interaction) => {

    const prefix = process.env.PREFIX;

    if(!messageCreate.content.startsWith(prefix) || messageCreate.author.bot) return;

    let profileData;
    try {
        profileData = await profileModel.findOne({ userID: messageCreate.author.id});
        if(!profileData){
            let profile = await profileModel.create({
                userID: messageCreate.author.id,
                serverID: messageCreate.guild.id,
                tokens: 200,
                bank: 0
            });
            profile.save();
        }
    } catch(err){
        console.log(err);
    }

    const args = messageCreate.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();

    const command = client.commands.get(cmd) || client.commands.find((a) => a.aliases && a.aliases.includes(cmd));
    if(!command) return messageCreate.channel.send(`This command doesn't exist - use ${prefix}commands to see a list of commands`);

    if(!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Collection());
    }

    const current_time = Date.now();
    const time_stamps = cooldowns.get(command.name);
    const cooldown_amount = (command.cooldown) * 1000;

    if(time_stamps.has(messageCreate.author.id)) {
        const expiration_time = time_stamps.get(messageCreate.author.id) + cooldown_amount;

        if (current_time < expiration_time) {
            const time_left = (expiration_time - current_time) / 1000;

            if (time_left > 3600) {
                const time_left2 = time_left/3600;
                return messageCreate.reply(`Please wait ${time_left2.toFixed(1)} more hours before using ${command.name}`);
            }
            
            return messageCreate.reply(`Please wait ${time_left.toFixed(1)} more seconds before using ${command.name}`);
        }
    }

    time_stamps.set(messageCreate.author.id, current_time);
    setTimeout(() => time_stamps.delete(messageCreate.author.id), cooldown_amount);

    try {
        command.execute(messageCreate, args, cmd, client, profileData);
    } catch(err) {
        messageCreate.reply("Error occured");
        console.log(err);
    }
}