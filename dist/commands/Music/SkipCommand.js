"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class SkipCommand extends discord_akairo_1.Command {
    constructor(client) {
        super('skip', {
            editable: false,
            aliases: ['skip', 's'],
            clientPermissions: ['CONNECT', 'SPEAK'],
            userPermissions: ['CONNECT'],
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
        await queue.skip();
        message.util.reply('Skipped!');
    }
}
exports.default = SkipCommand;
