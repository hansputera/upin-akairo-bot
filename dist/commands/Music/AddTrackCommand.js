"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class AddTrackCommand extends discord_akairo_1.Command {
    constructor(client) {
        super('addtrack', {
            aliases: ['add-track'],
            editable: false,
            ratelimit: 5,
            separator: '|',
            args: [{
                    id: "queries",
                    match: "separate"
                }],
            category: "music"
        });
        this.client = client;
    }
    async exec(message, { queries }) {
        const playlist = queries[0];
        if (!playlist)
            return message.util.reply('Please enter valid playlist, example: `addtrack thisisplaylist|Justin bieber`');
        const playlistData = await this.client.playlist.getPlaylist(playlist, message.author.id);
        if (!playlistData)
            return message.util.reply('I can\'t find that playlist!');
        const song = queries[1];
        if (!song)
            return message.util.reply('Please enter valid song, example: `addtrack thisisplaylist|Justin bieber`');
        const tracks = await this.client.musicManager.getSongs(`ytsearch:${song}`);
        if (!tracks[0])
            return message.util.reply('I can\'t find the song!');
        else {
            await this.client.playlist.addTrack(tracks[0], playlistData.data.name, message.author.id);
            message.util.reply(`Track **${tracks[0].info.title}** has been added to **${playlistData.data.name}**`);
        }
    }
}
exports.default = AddTrackCommand;
