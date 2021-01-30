import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import type Upin from "../../structures/Upin";

export default class NowPlayingCommand extends Command {
    constructor(public client: Upin) {
        super('nowplaying', {
            aliases: ['np', 'nowplaying'],
            ratelimit: 3,
            editable: true,
            category: "music"
        });
    }

    public async exec(message: Message) {
        const queue = this.client.musicManager.queue.get(message.guild!.id);
        if (!queue) return message.util!.reply('Nothing queue!');

        const embed = new MessageEmbed()
        .setAuthor(`${message.guild!.name} Queue`, message.guild!.iconURL()! ? message.guild!.iconURL()! : this.client.user?.displayAvatarURL()!)
        .setDescription(`
        Song: [${queue.songs![0].info.title}](${queue.songs![0].info.uri})
        Duration: ${this.client.utility.parseDur(queue.songs![0].info.length)}
        Uploader: ${queue.songs![0].info.author}
        Requester: ${(queue.songs![0] as any).requestedBy.tag}
        `)
        .setImage(`http://i3.ytimg.com/vi/${queue.songs![0].info.identifier}/hqdefault.jpg`)
        .setTimestamp();

        message.util!.send(embed);
    }
}