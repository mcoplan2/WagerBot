const fs = require('fs');

module.exports = (client) => {
    client.button_handler = async () => {
        const button_folders = fs.readdirSync('./buttons/');
        for( const folder of button_folders) {
            const button_files = fs.readdirSync(`./buttons/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of button_files) {
                const button = require(`../buttons/${folder}/${file}`);
                client.buttons.set(button.name, button)
            }
        }
    }
}