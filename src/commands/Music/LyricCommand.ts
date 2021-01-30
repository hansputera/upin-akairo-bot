import axios from "axios";
import { Command } from "discord-akairo";
import type { Message } from "discord.js";
import { MessageEmbed } from "discord.js";

export default class LyricCommand extends Command {
    constructor() {
        super('lyric', {
            aliases: ['lyrics'],
            editable: true,
            ratelimit: 1,
            args: [
                {
                    id: "song",
                    match: "rest",
                    prompt: {
                        start: "Please enter song title!",
                        retry: "Please enter song title!"
                    }
                }
            ],
            category: "music"
        });
    }

    public async exec(message: Message, { song }: { song: string; }) {
        const awaitMessage = await message.channel.send('Please wait!');
        const { data }: {
            data: {
                success: boolean;
                message: string;
                results: {
                    title: string;
                    picture: string;
                    url: string;
                    artist: { url: string; name: string; };
                    lyric: string;
                }[] | [];
            }
        } = await axios.get(`https://api.hansputera.me/lyrics/${encodeURIComponent(song)}`);
        if (!data.success) return awaitMessage.edit('I can\'t find that song lyric!');

        const lyric = data.results[0];
        const embed = new MessageEmbed()
        .setColor('RED')
        .setAuthor(`${lyric.title} Lyric`, lyric.picture)
        .setURL(lyric.url)
        .setDescription(lyric.lyric)
        .setThumbnail(lyric.picture)
        .setFooter('(c) Musixmatch', lyric.picture)
        .setTimestamp();

        awaitMessage.delete();
        message.util!.send(embed);
    }
}