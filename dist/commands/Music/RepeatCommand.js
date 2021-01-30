"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class RepeatCommand extends discord_akairo_1.Command {
    constructor(client) {
        super('repeat', {
            aliases: ['loop'],
            editable: false,
            ratelimit: 3
        });
        this.client = client;
    }
    exec(message) {
        if (!message.member.voice.channel)
            return message.util.reply("Please join to voice channel!");
        const queue = this.client.musicManager.queue.get(message.guild.id);
        if (!queue)
            return message.util.reply('Nothing queue!');
        if (queue.voiceChannel !== message.member.voice.channel)
            return message.util.reply('Please join to my voice channel!');
        queue.loop = !queue.loop;
        message.util.reply(`Looping was ${queue.loop ? "Enabled" : "Disbled"}`);
    }
}
exports.default = RepeatCommand;
