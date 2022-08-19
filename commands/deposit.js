const { MessageEmbed } = require('discord.js');
const { updateTokensAndBank } = require('../repository/token_repository');
require('dotenv').config();

module.exports = {
    name: "deposit",
    aliases: ["dep"],
    permissions: [],
    cooldown: 30,
    description: "deposit tokens into your bank",
    async execute(messageCreate, args, profileData) {

        const role_name = process.env.ROLE_NAME;
        const prefix = process.env.PREFIX;

        const eligibleRole = messageCreate.guild.roles.cache.find(role => role.name === role_name);

        // check if the user has the role before allowing them to use the command
        if(!messageCreate.member.roles.cache.has(eligibleRole.id)) {
            return messageCreate.channel.send(`You need to ${prefix}register before using this bot.`);
        }
        const amount = args[0];
        if (amount % 1 != 0 || amount <= 0) return messageCreate.channel.send("Deposit amount must be a natural number.");

        try {
            if (amount > profileData.tokens) return messageCreate.channel.send("You don't have that amount of tokens to deposit.");
            
            // update the users tokens and return the embed with their information.
            await updateTokensAndBank(messageCreate.author.id, -amount, amount);
            
            return messageCreate.channel.send({embeds: [new MessageEmbed()
                                .setColor(0x00FFFF)
                                .setAuthor({ name: `${messageCreate.author.username}'s Deposit Slip`, 
                                            iconURL: `${messageCreate.author.displayAvatarURL({dynamic:true})}` })
                                .addFields({ name: 'Deposited: ', value: `${amount}`, inline: true },)
                                .setTimestamp()]});
        } catch(err){
            console.log(err);
        }
    }   
}