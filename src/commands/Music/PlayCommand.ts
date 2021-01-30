import { Command } from "discord-akairo";
import { Message } from "discord.js";
import type Upin from "../../structures/Upin";

export default class PlayCommand extends Command {
    constructor(public client: Upin) {
        super('play', {
            aliases: ['play', 'p', 'forceplay'],
            args: [{
                id: "track",
                type: "string",
                match: "content",
                prompt: {
                    start: "Please type song title!",
                    retry: "Please type song title, (eg. One Direction Memories)",
                    retries: 5
                }
            }],
            editable: false,
            clientPermissions: ['CONNECT', 'SPEAK'],
            userPermissions: ['CONNECT'],
            channel: "guild"
        })
    }

    public async exec(message: Message, { track }: { track: string; }) {
        if (!message.member!.voice.channel) return message.util!.reply('Please join to voice channel!');
        const queue = this.client.musicManager.queue.get(message.guild!.id);
        if (queue && queue!.voiceChannel !== message.member!.voice.channel) return message.util!.reply('Please join to my voice channel!');
        const tracks = await this.client.musicManager.getSongs(`ytsearch:${track}`);
        if (!tracks.length) return message.util!.reply('I can\'t found that song!');
        await this.client.musicManager.handleVideo(message, message.member!.voice.channel!, tracks[0]);
    }
}