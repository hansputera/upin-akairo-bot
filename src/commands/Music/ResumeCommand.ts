import { Command } from "discord-akairo";
import type { Message } from "discord.js";
import type Upin from "../../structures/Upin";

export default class ResumeCommand extends Command {
    constructor(public client: Upin) {
        super('resume', {
            aliases: ['resume', 'continue'],
            editable: false,
            clientPermissions: ['CONNECT', 'SPEAK'],
            userPermissions: ['CONNECT'],
            category: "music"
        });
    }

    public async exec(message: Message) {
        if (!message.member!.voice.channel) return message.util!.reply('Please join to voice channel');
        const queue = this.client.musicManager.queue.get(message.guild!.id);
        if (!queue) return message.util!.reply('Nothing queue');
        if (queue!.voiceChannel !== message.member!.voice.channel) return message.util!.reply('Please join to my voice channel!');

        if (queue.playing) return message.util!.reply('Queue already resumed');
        await queue!.resume();
        message.util!.reply('Resumed');
    }
}