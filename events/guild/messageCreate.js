require('dotenv').config();
const ProfileModel = require('../../models/profileSchema');

module.exports = async (client, messageCreate) => {

    const prefix = process.env.PREFIX;

    if(!messageCreate.content.startsWith(prefix) || messageCreate.author.bot) return;

    let profileData;
    try {
        profileData = await ProfileModel.findOne({ userID: messageCreate.author.id});
        if(!profileData){
            let profile = await ProfileModel.create({
                userID: messageCreate.author.id,
                serverID: messageCreate.author.id,
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

    const command = client.commands.get(cmd);

    try {
        command.execute(messageCreate, args, client, profileData);
    } catch(err) {
        messageCreate.reply("Error occured");
        console.log(err);
    }
}