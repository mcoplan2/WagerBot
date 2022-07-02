
module.exports = async (interaction, client) => {
    console.log(interaction)
    if (interaction.isCommand) {
        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction, client);
        } catch (err) {
            console.log(err);
            await interaction.reply({
                content: 'There was an issue with this request',
                ephemeral: true
            });
        }
    } else if (interaction.isSelectMenu) {
        if (interaction.customId == "colour-select") {
            let colours = "";
            await interaction.values.forEach(async value => {
                colours += `${value}`
            });
            await interaction.replay({ content: `Wow fav colors: ${colours}`});
        }
    } else if (interaction.isButton) {
        const button = client.buttons.get(interaction.customId);
        if (!button) return await interaction.reply({content: `There was no button code found for this button.`});

        try {
            await button.execute(interaction, client);
        } catch (err) {
            console.log(err);
            await interaction.reply({
                content: 'There was an issue with this button',
                ephemeral: true
            });
        }
    }
}
