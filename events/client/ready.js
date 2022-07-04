require('dotenv').config();

module.exports = async (client) => {

    const prefix = process.env.PREFIX;
    console.log('Bot is ON!');

    await client.user.setActivity(`for ${prefix}help`, { type: 'WATCHING' });
}