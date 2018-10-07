const SteamAPI = require('steamapi');
const { steam_api_key } = require('./config/config.js');

const steam = new SteamAPI(steam_api_key);


module.exports = (message) => {
    const args = message.content.split(/ +/);
    if(args[0] === 'steam') {
        if(!args[1]) {
            message.reply('je moet wel een steam naam opgeven');
        }
        else {
            steam.resolve(args[1]).then(id => {
                steam.getUserOwnedGames(id).then(games => {
                    console.log(games);
                }).catch(console.error);
            }).catch(console.error);
        }
    }
};