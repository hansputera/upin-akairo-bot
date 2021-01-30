"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class RemoveTrackCommand extends discord_akairo_1.Command {
    constructor(client) {
        super('removetrack', {
            aliases: ['remove-track', 'deltrack', 'remtrack', 'delete-track'],
            separator: "|",
            ratelimit: 5,
            args: [{
                    id: "queries",
                    match: "separate"
                }]
        });
        this.client = client;
    }
    async exec(message, { queries }) {
        const playlist = queries[0];
        if (!playlist)
            return message.util.reply('Please enter playlist name, example: `addtrack thisisplaylist|TRACK_ID`');
        const playlistData = await this.client.playlist.getPlaylist(playlist, message.author.id);
        if (!playlistData)
            return message.util.reply('I can\'t find your playlist!');
        const trackId = queries[1];
        if (isNaN(parseInt(trackId)))
            return message.util.reply('Only number for track id!');
        const track = playlistData.data.tracks.find(trck => trck.trackID === parseInt(trackId));
        if (!track)
            return message.util.reply('If you don\'t know track id, please use `tracks` command');
        const deleted = await this.client.playlist.removeTrack(track.trackID, playlistData.data.name, message.author.id);
        if (!deleted)
            return message.util.reply('Something was wrong!');
        else {
            message.util.reply(`Track **${track.info.title}** has been deleted from **${playlistData.data.name}** playlist!`);
        }
    }
}
exports.default = RemoveTrackCommand;
