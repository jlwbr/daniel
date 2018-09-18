const { RichEmbed } = require('discord.js');

module.exports = {
    name: 'queue',
    description: 'het command om dingen met de wachtrij te doen.',
    guildOnly: true,
    execute(message, arg) {
        const server = servers[message.guild.id];
        if(!server) return message.reply('Er is nog geen wachtrij, gebruik !play om een numer toe te voegen');
        let queue = server.queue;
        if(!queue) return message.reply('Ér zitten geen nummers in de wachtrij, gebruik !play om een numer toe te voegen');
        if(arg[0] == 'clear') {
            queue = [];
            message.reply('de wachtrij is geleegd');
        }
        else if(arg[0] == 'list') {
            const embed = new RichEmbed()
            .setTitle('wachtrij');
            for(i = 0; i < queue.length; i++) {
                if (i === 24) { break; }
                embed.addField(queue[i].title, queue[i].url);
            }
            message.channel.send(embed);
        }
    },
};