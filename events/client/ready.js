require('dotenv').config();
const cron = require('node-cron');

module.exports = async (client) => {

    const prefix = process.env.PREFIX;
    console.log('Bot is ON!');
    cron.schedule('0 0 * * *', () => {
        const channel = client.channels.cache.get('<channel-id>'); // replace <channel-id> with the actual channel ID
        channel.send('?listen');
        setTimeout(() => {
          channel.send('?stop');
        }, 30000); // wait 30 seconds before sending the second message
      });

    await client.user.setActivity(`for ${prefix}help`, { type: 'WATCHING' });
}