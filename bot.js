const fs = require('fs');
const Discord = require('discord.js');
const { token, prefix } = require('./config/config.js');
const logger = require('./logger.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('ready', () => {
    logger.info('Bot ready');
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return message.reply(`Ik ken dat command niet, gebruik \`${prefix}help \` om te zien wat ik allemaal kan. `);

    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply('Ik kan dit command niet in DMs uitvoeren!');
    }

    if (!message.member.hasPermission(command.permission)) return message.reply('Je hebt niet de permissies om dit command uit te voeren!');

    if (command.args && !args.length) {
        let reply = `Dit command heeft argumenten nodig, ${message.author}!`;

        if (command.usage) {
            reply += `\nHet goede gebruik van dit command is: \`${prefix}${command.name} ${command.usage}\`.`;
        }
        return message.channel.send(reply);
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (!timestamps.has(message.author.id)) {
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }
    else {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`Héé, niet spammen hé, wacht ${timeLeft.toFixed(1)} seconden tot het opnieuw gebruiken van het \`${command.name}\` command.`);
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }

    try {
        command.execute(message, args);
    }
    catch (error) {
        logger.error(error);
        message.reply('Er was een error tijdens het uitvoeren van dat command!');
    }
});

client.login(token);