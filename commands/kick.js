const logger = require("winston");

module.exports = {
  name: "kick",
  description: "Kick een speler.",
  usage: "[naam speler]",
  permission: ["KICK_MEMBERS"],
  guildOnly: true,
  execute(message) {
    const user = message.mentions.users.first();
    if (user) {
      const member = message.guild.member(user);
      if (member) {
        member
          .kick("Gekickt via bot")
          .then(() => {
            message.reply(`${user.tag} is succesvol gekickt!`);
          })
          .catch(err => {
            message.reply("ik kon deze persoon niet kicken!");
            logger.error(err);
          });
      } else {
        message.reply("deze gebruiker is geen lid van deze server!");
      }
    } else {
      message.reply("je moet een gebruiker toevoegen om te kicken!");
    }
  }
};
