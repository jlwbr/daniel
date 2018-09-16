module.exports = {
    name: 'dobbelsteen',
    aliases: ['dobbel', 'dice'],
    description: 'Gooi met een dobbelsteen.',
    usage: '[aantal zijden]',
    execute(message, arg) {
        if (!arg.lenght) {
            const dice = Math.floor((Math.random() * 5) + 1);
            return message.channel.send('Je gooide ' + dice + '!');
        }
        else {
            if (!arg.isInteger) return message.channel.send('Je moet een getal invoeren!');
            const customDice = Math.floor((Math.random() * (arg - 1)) + 1);
            return message.channel.send('Je gooide ' + customDice + '!');
        }
    },
};
