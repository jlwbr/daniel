module.exports = {
    name: 'leave',
    description: 'Laat de bot het kanaal verlaten.',
    guildOnly: true,
    execute(message) {
        message.member.voiceChannel.leave();
        return message.reply('succesvol geleaved.');
    },
};