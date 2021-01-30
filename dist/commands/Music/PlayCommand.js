"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class PlayCommand extends discord_akairo_1.Command {
    constructor(client) {
        super('play', {
            aliases: ['play', 'p', 'forceplay'],
            category: "music",
            args: [{
                    id: "track",
                    type: "string",
                    match: "content",
                    prompt: {
                        start: "Please type song title!",
                        retry: "Please type song title, (eg. One Direction Memories)",
                        retries: 5
                    }
                }, {
                    id: "queryFlag",
                    match: "flag",
                    flag: ['--soundcloud', '-sc']
                }],
            editable: false,
            clientPermissions: ['CONNECT', 'SPEAK'],
            userPermissions: ['CONNECT'],
            channel: "guild"
        });
        this.client = client;
    }
    async exec(message, { track, queryFlag }) {
        if (!message.member.voice.channel)
            return message.util.reply('Please join to voice channel!');
        const queue = this.client.musicManager.queue.get(message.guild.id);
        if (queue && queue.voiceChannel !== message.member.voice.channel)
            return message.util.reply('Please join to my voice channel!');
        let query;
        if (queryFlag)
            query = "scsearch";
        else
            query = "ytsearch";
        const tracks = await this.client.musicManager.getSongs(`${query}:${track}`);
        if (!tracks.length)
            return message.util.reply('I can\'t found that song!');
        await this.client.musicManager.handleVideo(message, message.member.voice.channel, tracks[0]);
    }
}
exports.default = PlayCommand;
