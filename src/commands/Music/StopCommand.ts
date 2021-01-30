import { Command } from "discord-akairo";
import { Message } from "discord.js";
import Upin from "../../structures/Upin";

export default class StopCommand extends Command {
    constructor(public client: Upin) {
        super('stop', {
            aliases: ['stop', 'leave', 'disconnect', 'dc'],
            editable: false,
            clientPermissions: ['CONNECT', 'SPEAK'],
            userPermissions: ['CONNECT', 'SPEAK'],
            channel: "guild"
        });
    }
    public async exec(message: Message) {
        if (!message.member!.voice.channel) return message.util!.reply('Please join to voice channel!');
        const queue = this.client.musicManager.queue.get(message.guild!.id);
        if (!queue) return message.util!.reply('Nothing queue!');
        if (queue!.voiceChannel !== message.member!.voice.channel) return message.util!.reply('Please join to my voice channel!');
        await queue.destroy();
        message.util!.reply('Stopped, and leave!');
    }
}