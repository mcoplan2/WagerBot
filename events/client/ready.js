require('dotenv').config();
const cron = require('node-cron');

module.exports = async (client) => {

    const prefix = process.env.PREFIX;
    console.log('Bot is ON!');
    const channel = client.channels.cache.get('1288087805574123583');
    channel.send("?listen")
    cron.schedule('0 8 * * *', () => {
        const channel = client.channels.cache.get('1288087805574123583'); // replace <channel-id> with the actual channel ID
        channel.send('?stop');
        setTimeout(() => {
          channel.send('?listen');
        }, 30000); // wait 30 seconds before sending the second message
      });

    await client.user.setActivity(`for ${prefix}help`, { type: 'WATCHING' });
}