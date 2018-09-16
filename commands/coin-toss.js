module.exports = {
    name: 'flip',
    aliases: ['coin', 'toss'],
    description: 'Flip een muntje.',
    cooldown: 5,
    execute(message) {
        const int = Math.floor(Math.random() * 2);
        if (int === 0) {
            return message.channel.send('Je gooide kop!');
        }
        else {
            return message.channel.send('Je gooide munt!');
        }
    },
};
