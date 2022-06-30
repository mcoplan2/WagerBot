require('dotenv').config();
const ProfileModel = require('../../models/profileSchema');

module.exports = async (client, messageCreate) => {

    const prefix = process.env.PREFIX;

    if(!messageCreate.content.startsWith(prefix) || messageCreate.author.bot) return;

    let profileData;
    try {
        profileData = await ProfileModel.findOne({ userID: messageCreate.author.userID});
        if(!profileData){
            let profile = await ProfileModel.create({
                userID: messageCreate.author.userID,
                serverID: messageCreate.author.serverID,
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

    if(command) command.execute(client, messageCreate, args, profileData);
}