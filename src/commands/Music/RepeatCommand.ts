import { Command } from "discord-akairo";
import type { Message } from "discord.js";
import type Upin from "../../structures/Upin";

export default class RepeatCommand extends Command {
    constructor(public client: Upin) {
        super('repeat', {
            aliases: ['loop'],
            editable: false,
            ratelimit: 3
        });
    }

    public exec(message: Message) {
        if (!message.member!.voice.channel) return message.util!.reply("Please join to voice channel!");
        const queue = this.client.musicManager.queue.get(message.guild!.id);
        if (!queue) return message.util!.reply('Nothing queue!');
        if (queue!.voiceChannel !== message.member!.voice.channel) return message.util!.reply('Please join to my voice channel!');
        queue.loop = !queue.loop;
        message.util!.reply(`Looping was ${queue.loop ? "Enabled":"Disbled"}`);
    }
}