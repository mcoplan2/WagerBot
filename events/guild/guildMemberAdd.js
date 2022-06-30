const ProfileModel = require('../../models/profileSchema');

module.exports = async(client, member) => {
    let profile = await ProfileModel.create({
        userID: member.id,
        serverID: member.guild.id,
        tokens: 200,
        bank: 0
    });
    profile.save();
}