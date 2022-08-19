const profileModel = require('../models/profileSchema');
const { MessageEmbed } = require('discord.js');
const { updateTokensAndBank } = require('../repository/token_repository');
require('dotenv').config();

module.exports = {
    name: "withdraw",
    aliases: ["wd"],
    permissions: [],
    cooldown: 30,
    description: "withdraw tokens from your bank",
    async execute(messageCreate, args, profileData) {

        const role_name = process.env.ROLE_NAME;
        const prefix = process.env.PREFIX;

        const eligibleRole = messageCreate.guild.roles.cache.find(role => role.name === role_name);

        // check if the user has the role before allowing them to use the command
        if(!messageCreate.member.roles.cache.has(eligibleRole.id)) {
            return messageCreate.channel.send(`You need to ${prefix}register before using this bot.`)
        }
        const amount = args[0];
        if (amount % 1 != 0 || amount <= 0) return messageCreate.channel.send("Withdraw amount must be a natural number.");

        try {
            if (amount > profileData.bank) return messageCreate.channel.send("You don't have that amount of tokens in your bank.");
            
            // update the users tokens and return the embed with their information.
            await updateTokensAndBank(messageCreate.author.id, amount, -amount);

            return messageCreate.channel.send({embeds: [new MessageEmbed()
                                .setColor(0x00FFFF)
                                .setAuthor({ name: `${messageCreate.author.username}'s Withdrawal slip`, 
                                            iconURL: `${messageCreate.author.displayAvatarURL({dynamic:true})}` })
                                .addFields({ name: 'Withdrew: ', value: `${amount}`, inline: true },)
                                .setTimestamp()]});

        } catch(err){
            console.log(err)
        }     
    }
}