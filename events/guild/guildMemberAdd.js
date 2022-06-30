const ProfileModel = require('../../models/profileSchema');

module.exports = async(client, member) => {
    let profile = await ProfileModel.create({
        userID: member.userID,
        serverID: member.guild.userID,
        tokens: 200,
        bank: 0
    });
    profile.save();
}