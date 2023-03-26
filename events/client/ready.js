require('dotenv').config();
const cron = require('node-cron');

module.exports = async (client) => {

    const prefix = process.env.PREFIX;
    console.log('Bot is ON!');
    cron.schedule('0 0 * * *', () => {
        const channel = client.channels.cache.get('1084902149982531728'); // replace <channel-id> with the actual channel ID
        channel.send('?stop');
        setTimeout(() => {
          channel.send('?');
        }, 30000); // wait 30 seconds before sending the second message
      });

    await client.user.setActivity(`for ${prefix}help`, { type: 'WATCHING' });
}