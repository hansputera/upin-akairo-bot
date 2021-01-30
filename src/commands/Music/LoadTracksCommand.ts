import { Command } from "discord-akairo";
import type { Message } from "discord.js";
import type Upin from "../../structures/Upin";

export default class LoadTracksCommand extends Command {
    constructor(public client: Upin) {
        super('loadtracks', {
            aliases: ['load-tracks', 'loadtrack'],
            editable: false,
            args: [
                {
                    id: "playlist",
                    match: "rest",
                    prompt: {
                        start: "Please enter playlist name!",
                        retry: "Please enter playlist name!"
                    }
                }
            ],
            ratelimit: 1,
            category: "music"
        });
    }

    public async exec(message: Message, { playlist }:{ playlist: string; }) {
        const playlistData = await this.client.playlist.getPlaylist(playlist, message.author.id);
        if (!playlistData) return message.util!.reply('I can\'t find your playlist!');

        if (!playlistData.data.tracks!.length) return message.util!.reply('Nothing tracks in your playlist tracks, please add track to your playlist before load the tracks!');
        if (!message.member!.voice.channel) return message.util!.reply('Please join to voice channel, before load the tracks!');
        const queue = this.client.musicManager.queue.get(message.guild!.id);
        if (queue && queue.voiceChannel.id !== message.member!.voice.channel.id) return message.util!.reply('Now, this guild already have queue. Please join to my voice channel!');
        playlistData.data.tracks!.forEach(async track => {
            await this.client.musicManager.handleVideo(message, message.member!.voice.channel!, {
                track: track.track,
                info: track.info
            });
        });
        message.util!.reply('Successfuly load the tracks from ' + playlistData.data.name + ' playlist!');
    }
}