const logger = require('winston');

module.exports = {
    name: 'ban',
    description: 'Ban een speler.',
    usage: '[naam speler]',
    permission: [ 'KICK_MEMBERS' ],
    guildOnly: true,
    execute(message) {
        const user = message.mentions.users.first();
        if (user) {
          const member = message.guild.member(user);
          if (member) {
            member.ban({ reason: 'Wees niet stout' }).then(() => {
              message.reply(`${user.tag} is succesvol geband`);
            }).catch(err => {
              message.reply('ik kon deze persoon niet bannen');
              logger.error(err);
            });
          }
          else {
            message.reply('deze gebruiker is niet in de server!');
          }
        }
        else {
          message.reply('je moet een gebruiker toevoegen om te bannen!');
        }
    },
};