const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { getDifference, sleep } = require('../utils/functions');
const { updateTokens } = require('../repository/token_repository');
require('dotenv').config();

module.exports = {
    name: "longbet",
    aliases: ["lb"],
    permissions: [],
    cooldown: 10,
    description: "A bet that lasts around 30 minutes",
    async execute(messageCreate) {

        const role_name = process.env.ROLE_NAME;
        const prefix = process.env.PREFIX;
        const role_id = process.env.DISCORD_ROLE;

         // grab the role
        const eligibleRole = messageCreate.guild.roles.cache.find(role => role.name === role_name);

        // check if the user has the role before allowing them to use the command
        if(!messageCreate.member.roles.cache.has(eligibleRole.id)) {
            return messageCreate.channel.send(`You need to ${prefix}register before using this bot.`)
        }

        // Grab the string of the entire command
        // {!sb String here}
        let message = await messageCreate.fetch();

        // Remove the command from the string
        // !sb { keeps this part }
        const tokensAndString = message.content.substring(message.content.indexOf(' ')+1);
        let string = tokensAndString.substring(tokensAndString.indexOf(' ')+1);
        const tokenAmount = tokensAndString.split(" ");

        // Intialize variables and objects
        let newstring = "**"+string+"**";
        let newstring2 = ""+string+"";
        let count = 0;

        // If user does not enter a token amount set the include the entire string.
        isNaN(tokenAmount[0]) ? string = tokensAndString : string = string;
        // If user does not enter a token amount set the default to 100.
        isNaN(tokenAmount[0]) ? tokens = 100 : tokens = tokenAmount[0];
    
        // Create button and embed objects
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('yes')
                    .setLabel('Yes')
                    .setStyle('SUCCESS'),    
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('no')
                    .setLabel('No')
                    .setStyle('DANGER')
            );

        const row2 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('yes')
                    .setLabel('Yes')
                    .setStyle('SUCCESS'),    
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('no')
                    .setLabel('No')
                    .setStyle('DANGER')
            );

        const newEmbed = new MessageEmbed()
            .setColor(0x00FFFF)
            .setDescription(newstring)
            .addFields({ name: 'Rules:', value: 'One entry allowed\nMultiple entries will be disqualified'},)
            .setFooter({ text: `Token Cost: ${tokens}    |   Time Limit: 5 minute to enter   |   Duration: 30 minutes` })

        const newEmbed2 = new MessageEmbed()
            .setColor(0xFF0000)
            .setTitle("Choose the result")
            .setDescription(newstring2)
    
        // Issue the first embed to the user on the creation of the bet
        let messageEmbed = await messageCreate.channel.send({embeds: [newEmbed], components: [row]});

        // start the collection event of button clicks
        const filter = i => ((i.customId === "yes") || (i.customId === "no"));
        const collector = messageEmbed.createMessageComponentCollector({ filter, time: 270000});
        const message3 = await messageCreate.channel.send(`${count} entered this bet, <@&${role_id}>`);

        collector.on("collect", async (i) => {
            await i.deferUpdate();
            await message3.edit(`${++count} entered this bet, <@&${role_id}>`);
        })

        const yes_users = new Set();
        const no_users = new Set();
        // Add each user to a Set based on which button they pressed and disable the buttons as the event has ended
        collector.on("end", async (collected) => {
            collected.forEach( async (value) => {
                if(value.customId === "yes") {
                    yes_users.add(value.user.id);
                }
                else if(value.customId === "no") {
                    no_users.add(value.user.id);
                }
                row.components[0].setDisabled(true);
                row.components[1].setDisabled(true);
                await messageEmbed.edit({embeds: [newEmbed], components: [row]});
            })


            // function to remove duplicates from each set incase they tried to enter both a 'Yes' and 'No' response
            // we will remove both these results since you should only be allowed to choose one option.
            const yes_users_no_dups = getDifference(yes_users, no_users);
            const no_users_no_dups = getDifference(no_users, yes_users);
            
            // Duration of the bet, Currently 30m, change this value to increase/decrease duration
            await sleep(1800000)

            // Create another embed to ask the user for the result
            let messageEmbed2 = await messageCreate.channel.send({embeds: [newEmbed2], components: [row2]})
            const filter = i => ((i.customId === "yes") || (i.customId === "no"))
            const collector2 = messageEmbed2.createMessageComponentCollector({ filter, max:1 })
            collector2.on("collect", async (i) => {
                row2.components[0].setDisabled(true);
                row2.components[1].setDisabled(true);
                messageEmbed2.edit({embeds: [newEmbed2], components: [row2]});
                await i.reply(`${i.user.username} clicked on the ${i.customId} button.`);
            })
        
            // Update database with the results gathered above
            collector2.on("end", async (collected2) => {
                collected2.forEach( async (value) => {
                    if(value.customId === 'yes') {
                        try {
                            yes_users_no_dups.forEach( async (user) => {
                                let all_entries = yes_users_no_dups.size + no_users_no_dups.size;
                                let total_amount = tokens * all_entries;
                                let size = yes_users_no_dups.size;
                                let realamount = parseInt(total_amount / size);
                                if (realamount == tokens) realamount = tokens/2;
                            
                                await updateTokens(user, realamount);
                            })

                            no_users_no_dups.forEach( async (user) => {
                                // If they lose, just subtract the token amount from their total.
                                let amount = tokens;

                                await updateTokens(user, -amount);
                            })
                        } catch(err) {
                            console.log(err);
                        }
                    } else if (value.customId === "no") {
                        try {
                            no_users_no_dups.forEach( async (user) => {
                                let all_entries = yes_users_no_dups.size + no_users_no_dups.size;
                                let total_amount = tokens * all_entries;
                                let size = no_users_no_dups.size;
                                let realamount = parseInt(total_amount / size);
                                if (realamount == tokens) realamount = tokens/2;

                                await updateTokens(user, realamount);
                            })

                            yes_users_no_dups.forEach( async (user) => {
                                // If they lose, just subtract the token amount from their total.
                                let amount = tokens;

                                await updateTokens(user, -amount);
                            })
                        } catch (err) {
                            console.log(err);
                        }
                    }
                });   
            })
        }
    )},
}