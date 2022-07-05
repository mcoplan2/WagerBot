const profileModel = require('../models/profileSchema');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
require('dotenv').config();

module.exports = {
    name: "longbet",
    aliases: ["lb"],
    permissions: [],
    cooldown: 10,
    description: "A bet that lasts around 30 minutes",
    async execute(messageCreate, interaction, args, cmd, client, profileData) {

        const role_name = process.env.ROLE_NAME;

        const eligibleRole = messageCreate.guild.roles.cache.find(role => role.name === role_name);

        // check if the user has the role before allowing them to use the command
        if(messageCreate.member.roles.cache.has(eligibleRole.id)) {

            // grab the string of the entire command
            // {!ffa String here}
        message = await messageCreate.fetch();

        // remove the command from the string
        // !ffa { keeps this part }
        const string = message.content.substring(message.content.indexOf(' ')+1);
        
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
    
        newstring = "**Will "+string+'**';
        newstring2 = "Did "+string;


        let count =0;

                
        const newEmbed = new MessageEmbed()
            .setColor(0x00FFFF)
            .setDescription(newstring)
            .addFields(
                { name: 'Rules:', value: 'One entry allowed'+'\n'
                                        +'Multiple entries will be disqualified'},
            )
            .setFooter({ text: 'Token Cost: 100    |   Time Limit: 3 minutes to enter   |   Duration: 30 minutes' })

        const newEmbed2 = new MessageEmbed()
            .setColor(0x00FFFF)
            .setTitle("Choose the result")
            .setDescription(newstring2)
        
        let messageEmbed = await messageCreate.channel.send({embeds: [newEmbed], components: [row]});


        const filter = i => ((i.customId === "yes") || (i.customId === "no"));
        const collector = messageEmbed.createMessageComponentCollector({ filter, time: 180000});
        const message3 = await messageCreate.channel.send(`${count} entered the bet`);

        collector.on("collect", async (i) => {
            await i.deferUpdate();
            await message3.edit(`${++count} entered the bet`);
        })

        const yes_users = new Set();
        const no_users = new Set();
        // Add each user to a Set based on which button they pressed.
        collector.on("end", async (collected) => {
            collected.forEach( async (value) => {
                if(value.customId === "yes") {
                    yes_users.add(value.user.id);
                }
                else if(value.customId === "no") {
                    no_users.add(value.user.id);
                }
            })

            // function to remove duplicates from each set incase they tried to enter both a 'Yes' and 'No' response
            // we will remove both these results since you should only be allowed to choose one option.
            function getDifference(setA, setB) {
                return new Set(
                    [...setA].filter(element => !setB.has(element))
                );
            }
            const set1 = yes_users;
            const set2 = no_users;

            const yes_users_no_dups = getDifference(set1, set2);
            const no_users_no_dups = getDifference(set2, set1);

            // ADD 30M WAIT TIMER HERE
            // WE WANT TO WAIT THE "BET" TO END SO THE USER CAN SELECT THEIR RESULT
            // COULD REFACTOR TO IMPLEMENT SOMEONE SENDING A REQUEST WITH THE ANSWER

            await sleep(1800000)
            function sleep(ms) {
                return new Promise(async(resolve) => {
                    setTimeout(resolve, ms);
                });
            }
            // THIS SECTION IS THE 2nd PART WHERE THE USER SELECTS THEIR RESULT FROM THE BET
            // Create Another Embed after the above ends to pass in the result of if they won or lost.
            let messageEmbed2 = await messageCreate.channel.send({embeds: [newEmbed2], components: [row]})
            const filter = i => ((i.customId === "yes") || (i.customId === "no"))
            const collector2 = messageEmbed2.createMessageComponentCollector({ filter, max: 1})
            collector2.on("collect", async (i) => {
                row.components[0].setDisabled(true);
                row.components[1].setDisabled(true);
                messageEmbed2.edit({embeds: [newEmbed2], components: [row]});
                await i.reply(`${i.user.username} clicked on the ${i.customId} button.`);
            })
            
            // FINALLY WE NEED TO UPDATE THE DATABASE WITH THE RESULTS
            // THIS WILL BE THE LOGIC FOR THE DATABASE
            collector2.on("end", async (collected2) => {
                collected2.forEach( async (value) => {
                    if(value.customId === 'yes') {
                        try {
                        yes_users_no_dups.forEach( async (user) => {
                            // SOME LOGIC HERE ABOUT AMOUNT OF TOKENS
                            let all_entries = yes_users_no_dups.size + no_users_no_dups.size;
                            let total_amount = 100 * all_entries;
                            let size = yes_users_no_dups.size;
                            let realamount = parseInt(total_amount / size);
                            if (realamount == 100) realamount = 0;
                            await profileModel.findOneAndUpdate({
                                userID: user,
                            }, {
                                $inc: {
                                    tokens: realamount
                                },
                            });
                            messageCreate.send
                        })

                        no_users_no_dups.forEach( async (user) => {
                            // If they lose, just subtract 100 from their total
                            let amount = 100;
                            await profileModel.findOneAndUpdate({
                                userID: user,
                            }, {
                                $inc: {
                                    tokens: -amount
                                },
                            });
                        })
                        } catch(err) {
                            console.log(err);
                        }
                    }
                    else if(value.customId === "no") {
                        try {
                            no_users_no_dups.forEach( async (user) => {
                                // SOME LOGIC HERE ABOUT AMOUNT OF TOKENS
                                let all_entries = yes_users_no_dups.size + no_users_no_dups.size;
                                let total_amount = 100 * all_entries;
                                let size = no_users_no_dups.size;
                                let realamount = parseInt(total_amount / size);
                                // this means
                                if (realamount == 100) realamount = 0;
                                await profileModel.findOneAndUpdate({
                                    userID: user,
                                }, {
                                    $inc: {
                                        tokens: realamount
                                    },
                                });
                            })

                            yes_users_no_dups.forEach( async (user) => {
                                // If they lose, just subtract 100 from their total
                                let amount = 100;
                                await profileModel.findOneAndUpdate({
                                    userID: user,
                                }, {
                                    $inc: {
                                        tokens: -amount
                                    },
                                });
                            })
                        } catch (err) {
                            console.log(err);
                        }
                    }
                });   
            })
        }
    )

        } else {
            return messageCreate.channel.send("You need to !register before using this bot.")
        }
        
    },
}