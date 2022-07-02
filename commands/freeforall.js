const profileModel = require('../models/profileSchema');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    name: "free for all",
    aliases: ["ffa"],
    permissions: [],
    cooldown: 10,
    description: "Free for all against everyone that reacts!",
    async execute(messageCreate, interaction, args, cmd, client, profileData) {
        // grab the string of the entire command
        // {!ffa String here}
        message = await messageCreate.fetch();

        // remove the command from the string
        // !ffa { keeps this part }
        const string = message.content.substring(message.content.indexOf(' ')+1);
        
        const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('primary')
					.setLabel('Yes')
					.setStyle('SUCCESS'),    
			)
			.addComponents(
				new MessageButton()
					.setCustomId('primary2')
					.setLabel('No')
                    .setStyle('DANGER')
            );
    
            // Grab any mentions from the user !FFA @User win their game
            // ON !REGISTER CHANGE ROLE
            // @ EVERYBODY WITH !REGISTER ROLE WHEN THIS COMMAND IS EXECUTED
            // STORE INFORMATION IN BUTTONS
            // in 15-20M @ EVERYBODY WHO ENTERED ASKING "DID +String ?" 
            // IF CLICK YOU GUESSED SAME AS OUTCAME(i.e USER WON AND YOU CLICKED YES)
                    // THEN YOU GAIN A NUMBER OF TOKENS IN UR WALLET
            // ELSE YOU LOSE A NUMBER OF TOKENS IN YOUR WALLET
        newstring = "Will "+string;
            // TODO MAKE A NEW EVENT WATCH VIDEO!

                
        const newEmbed = new MessageEmbed()
            .setColor(0x00FFFF)
            .setTitle("Choose an Outcome")
            .setDescription(newstring)
            .setTimestamp()
            .setThumbnail('attachment://index.jpg')
        
        const messageEmbed = await messageCreate.channel.send({embeds: [newEmbed], components: [row]})

        const collector = messageEmbed.createMessageComponentCollector({ componentType: 'BUTTON', time: 6000})
        collector.on("collect", async (i) => {
            await i.reply(`${i.user.username} clicked on the ${i.customId} button.`);
        })
        collector.on("end", async (collected) => {
            console.log(`Collected ${collected.size} items`);
            console.log(collected);
        })

        


        /*
        client.on('interactionCreate', interaction => {

            if (!interaction.isButton()) return;

            console.log(interaction.user.username);

            const collector = interaction.message.createMessageComponentCollector({ componentType: 'BUTTON', time: 10 });

            console.log(collector)

            collector.on('collect', i => {
	            if (i.user.id === interaction.user.id) {
		            i.reply(`${i.user.id} clicked on the ${i.customId} button.`);
	            } else {
		            i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
	            }
            });

            collector.on('end', collected => {
	            console.log(`Collected ${collected.size} interactions.`);
            });

        })

        */
    }

}