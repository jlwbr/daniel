const logger = require('winston');
const ytdl = require('ytdl-core');
const YouTube = require('simple-youtube-api');
const { google_api_key } = require('../config/config.js');

const youtube = new YouTube(google_api_key);

function play(connection, message) {
    const server = servers[message.guild.id];
    server.dispatcher = connection.playArbitraryInput(ytdl(
        server.queue[0].url,
        { filter: 'audioonly' }));
    message.channel.send(`${server.queue[0].title} wordt voor je gedraaid.`);
    server.dispatcher.on('end', function() {
        if(server.queue[0]) {
            play(connection, message);
        }
        else {
            message.member.voiceChannel.leave();
            server.playing = false;
        }
    });
}

module.exports = {
    name: 'play',
    aliases: ['speel'],
    description: 'Speel een nummertje af.',
    usage: '[YouTube link]',
    guildOnly: true,
    execute(message, args) {
        if (!message.member.voiceChannel) return message.reply('je moet in een voice channel zitten!');
        if (message.guild.voiceChannel) return message.reply('je moet in een voice channel in deze server zitten!');

        if(!servers[message.guild.id]) {
            servers[message.guild.id] = {
                queue: [],
                playing: false
            };
        }

        const server = servers[message.guild.id];

        if (!message.guild.voiceConnection) return play(connection, message);

        if(args[0].match(/^https?:\/\/(www.youtube.com|youtube.com)\/watch(.*)$/)) {
            youtube.getVideo(args[0])
            .then(video => {
                server.queue.push(video);
                if (!message.guild.voiceConnection) return play(connection, message);
                message.channel.send(`${video.title} is aan de wachtrij toegevoegd.`);
            }).catch((e) => {
                logger.error(e);
            });
        }
        else if(args[0].match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            youtube.getPlaylist(args[0])
            .then(playlist => {
                playlist.getVideos()
                .then(videos => {
                    server.queue.push(videos);
                    message.channel.send(`de afspeellijst ${playlist.title} is aan de wachtrij toegevoegd.`);
                }).catch(logger.error);
            }).catch(console.log);
        }
        else {
            youtube.searchVideos(args[0], 1)
            .then(results => {
                server.queue.push(results[0]);
                if (!message.guild.voiceConnection) return play(connection, message);
                message.channel.send(`${results[0].title} is aan de wachtrij toegevoegd.`);
            }).catch((e) => {
                logger.error(e);
            });
        }

        if (!server.playing) {
            message.member.voiceChannel.join().then(connection => {
                play(connection, message);
            }).catch((e) => {
                logger.error(e);
            });
            server.playing = true;
        }
    },
};