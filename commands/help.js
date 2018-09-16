const logger = require('winston');
const { prefix } = require('../config/config.js');

module.exports = {
    name: 'help',
    description: 'hier vind je alle commands.',
    aliases: ['commands'],
    usage: '[command name]',
    cooldown: 5,
    execute(message, args) {
        const data = [];
        const { commands } = message.client;
        if (!args.length) {
            data.push('Hier is een lijst van al mijn commands:');
            data.push(commands.map(command => command.name).join(', '));
            data.push(`\nGebruik \`${prefix}help [command naam]\` om meer info te krijgen over een specifiek command!`);
            return message.author.send(data, { split: true })
            .then(() => {
                if (message.channel.type === 'dm') return;
                message.reply('Ik heb je een DM gestuurd met al mijn commands!');
            })
            .catch(error => {
                logger.error(`Kon geen dm sturen naar ${message.author.tag}.\n`, error);
                logger.reply('het ziet er naar uit dat ik jouw geen DM\'s kan sturen heb je DM uitstaan?');
            });
        }
        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('that\'s not a valid command!');
        }

        data.push(`**Naam:** ${command.name}`);

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Beschrijving:** ${command.description}`);
        if (command.usage) data.push(`**Gebruik:** ${prefix}${command.name} ${command.usage}`);

        data.push(`**Cooldown:** ${command.cooldown || 3} seconde(s)`);

        message.channel.send(data, { split: true });
    }
};