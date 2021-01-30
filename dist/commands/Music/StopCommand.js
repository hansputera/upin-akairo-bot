"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class StopCommand extends discord_akairo_1.Command {
    constructor(client) {
        super('stop', {
            aliases: ['stop', 'leave', 'disconnect', 'dc'],
            editable: false,
            clientPermissions: ['CONNECT', 'SPEAK'],
            userPermissions: ['CONNECT', 'SPEAK'],
            channel: "guild",
            category: "music"
        });
        this.client = client;
    }
    async exec(message) {
        if (!message.member.voice.channel)
            return message.util.reply('Please join to voice channel!');
        const queue = this.client.musicManager.queue.get(message.guild.id);
        if (!queue)
            return message.util.reply('Nothing queue!');
        if (queue.voiceChannel !== message.member.voice.channel)
            return message.util.reply('Please join to my voice channel!');
        await queue.destroy();
        message.util.reply('Stopped, and leave!');
    }
}
exports.default = StopCommand;
