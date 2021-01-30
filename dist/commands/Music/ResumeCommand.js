"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class ResumeCommand extends discord_akairo_1.Command {
    constructor(client) {
        super('resume', {
            aliases: ['resume', 'continue'],
            editable: false,
            clientPermissions: ['CONNECT', 'SPEAK'],
            userPermissions: ['CONNECT']
        });
        this.client = client;
    }
    async exec(message) {
        if (!message.member.voice.channel)
            return message.util.reply('Please join to voice channel');
        const queue = this.client.musicManager.queue.get(message.guild.id);
        if (!queue)
            return message.util.reply('Nothing queue');
        if (queue.voiceChannel !== message.member.voice.channel)
            return message.util.reply('Please join to my voice channel!');
        if (queue.playing)
            return message.util.reply('Queue already resumed');
        await queue.resume();
        message.util.reply('Resumed');
    }
}
exports.default = ResumeCommand;
