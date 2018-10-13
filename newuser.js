const SteamAPI = require('steamapi');
const { steam_api_key } = require('./config/config.js');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

const steam = new SteamAPI(steam_api_key);

module.exports = (message) => {
    const args = message.content.split(/ +/);
    const users = db.get('users').value();
    const user = users.find(item => {
        return item.id == message.author.id;
    });

    if (!user) {
        db.get('users').push({ id: message.author.id, stage: 0, games: {} }).write();
        message.reply('heb je een steam account?');
    }
    else if (user.stage == 0 && args[0] == 'ja' || args[0] == 'Ja') {
        message.reply('Wat is jouw steam naam?');
        db.get('users').push({ id: message.author.id, stage: 1, games: {} }).write();
    }
    else if (user.stage == 1) {
        steam.resolve(args[0]).then(id => {
            steam.getUserOwnedGames(id).then(games => {
                db.get('users').push({ id: message.author.id, stage: 2, games: games }).write();
            }).catch(console.error);
        }).catch(
            message.reply('deze steam naam bestaat niet!')
        );
    }
};