const logger = require('winston');

module.exports = {
    name: 'ban',
    description: 'Ban een gebruiker.',
    usage: '[naam gebruiker]',
    permission: [ 'BAN_MEMBERS' ],
    guildOnly: true,
    execute(message) {
        const user = message.mentions.users.first();
        if (user) {
          const member = message.guild.member(user);
          if (member) {
            member.ban({ reason: 'Lief doen, hè!' }).then(() => {
              message.reply(`${user.tag} is succesvol geband!`);
            }).catch(err => {
              message.reply('ik kon deze persoon niet bannen!');
              logger.error(err);
            });
          }
          else {
            message.reply('deze gebruiker zit niet in de server!');
          }
        }
        else {
          message.reply('je moet een naam toevoegen om te bannen!');
        }
    },
};
