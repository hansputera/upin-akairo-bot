import { Command } from "discord-akairo";
import type { Message } from "discord.js";
import type Upin from "../../structures/Upin";

export default class SkipCommand extends Command {
    constructor(public client: Upin) {
        super('skip', {
            editable: false,
            aliases: ['skip', 's'],
            clientPermissions: ['CONNECT', 'SPEAK'],
            userPermissions: ['CONNECT'],
            category: "music"
        });
    }

    public async exec(message: Message) {
        if (!message.member!.voice.channel) return message.util!.reply('Please join to voice channel!');
        const queue = this.client.musicManager.queue.get(message.guild!.id);
        if (!queue) return message.util!.reply('Nothing queue!');
        if (queue!.voiceChannel !== message.member!.voice.channel) return message.util!.reply('Please join to my voice channel!');
        await queue.skip();
        message.util!.reply('Skipped!');
    }
}