require('dotenv').config();
const profileModel = require('../../models/profileSchema');

module.exports = async (client, messageCreate) => {

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
    if(!command) return messageCreate.channel.send("This command doesn't exist - use !commands to see a list of commands");

    try {
        command.execute(messageCreate, args, cmd, client, profileData);
    } catch(err) {
        messageCreate.reply("Error occured");
        console.log(err);
    }
}