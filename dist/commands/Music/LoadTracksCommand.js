"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class LoadTracksCommand extends discord_akairo_1.Command {
    constructor(client) {
        super('loadtracks', {
            aliases: ['load-tracks', 'loadtrack'],
            editable: false,
            args: [
                {
                    id: "playlist",
                    match: "rest",
                    prompt: {
                        start: "Please enter playlist name!",
                        retry: "Please enter playlist name!"
                    }
                }
            ],
            ratelimit: 1
        });
        this.client = client;
    }
    async exec(message, { playlist }) {
        const playlistData = await this.client.playlist.getPlaylist(playlist, message.author.id);
        if (!playlistData)
            return message.util.reply('I can\'t find your playlist!');
        if (!playlistData.data.tracks.length)
            return message.util.reply('Nothing tracks in your playlist tracks, please add track to your playlist before load the tracks!');
        if (!message.member.voice.channel)
            return message.util.reply('Please join to voice channel, before load the tracks!');
        const queue = this.client.musicManager.queue.get(message.guild.id);
        if (queue && queue.voiceChannel.id !== message.member.voice.channel.id)
            return message.util.reply('Now, this guild already have queue. Please join to my voice channel!');
        playlistData.data.tracks.forEach(async (track) => {
            await this.client.musicManager.handleVideo(message, message.member.voice.channel, {
                track: track.track,
                info: track.info
            });
        });
        message.util.reply('Successfuly load the tracks from ' + playlistData.data.name + ' playlist!');
    }
}
exports.default = LoadTracksCommand;
