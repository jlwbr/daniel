module.exports = {
    name: 'play',
    aliases: ['speel'],
    description: 'Speel een nummertje af.',
    usage: '[YouTube link]',
    guildOnly: true,
    execute(message, arg) {
        if(message.member.voiceChannel) {
            if(!message.guild.voiceConnection) {
                if(!servers.message.guild.id) {
                    servers[message.guild.id] = {
                        queue: []
                    };
                }
                const server = servers[message.guild.id];
                message.member.voiceChannel.join()
                    .then(connection => {
                        return message.reply('succesvol gejoined.');
                    });
            }
        }
        else {
            return message.reply('je moet in een spraakkanaal zitten om me op te roepen.');
        }
    },
};