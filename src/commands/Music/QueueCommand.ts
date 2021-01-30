import { Command } from "discord-akairo";
import type { Message } from "discord.js";
import { MessageReaction } from "discord.js";
import { User } from "discord.js";
import { MessageEmbed } from "discord.js";
import type Upin from "../../structures/Upin";

export default class QueueCommand extends Command {
    constructor(public client: Upin) {
        super('queue', {
            aliases: ['queue', 'q'],
            editable: true
        });
    }

    public async exec(message: Message) {
        const queue = this.client.musicManager.queue.get(message.guild!.id);
        if (!queue) return message.util!.reply('Nothing queue');

        const embed = new MessageEmbed()
        .setColor('RANDOM')
        .setAuthor(`${message.guild!.name} Queue`,
        message.guild!.iconURL()! ? message.guild!.iconURL()! : this.client.user!.displayAvatarURL()!)
        .setTimestamp();

        if (queue!.songs!.length < 2) embed.setDescription(`1. ${queue!.songs![0].info.title}`);
        else {
            let index = 0;
            let songs_ = queue!.songs!.sort().map((x, i) => `\`${i+1}.\` - ${x.info.title}`);
            let songs = this.client.utility.chunk(songs_, 5);
            const embed = new MessageEmbed()
            .setTitle('Currently Queue')
            .setDescription((songs[index] as any).join('\n'))
            .setFooter(`[${index+1}/${songs.length}] Currently playing ${queue!.songs![0].info.title}`, `http://i3.ytimg.com/vi/${queue!.songs![0].info.identifier}/hqdefault.jpg`)
            .setColor('RANDOM');
            let m = await message.util!.send(embed);

            m.react('◀')
            m.react('🔴')
            m.react('▶')
            async function apa() {
                let filter = (rect: MessageReaction, usr: User) => ['◀','🔴','▶'].includes(rect.emoji.name) && usr.id === message.author.id;
                let res = await m.awaitReactions(filter, {
                     max:1,
                     time: 30 * 1000
                });
                if (!res.size) return undefined;
                let emoji = res.first()!.emoji.name;
                if (emoji === '◀') index--;
                if (emoji === '🔴') m.delete();
                if (emoji === '▶') index++;
                index = ((index % songs.length) + songs.length) % songs.length;
                embed.setDescription((songs[index] as any).join('\n'));
                embed.setFooter(`[${index+1}/${songs.length}] Currently playing ${queue!.songs![0].info.title}`, 'http://i3.ytimg.com/vi/' + queue!.songs![0].info.identifier + '/hqdefault.jpg')
                m.edit(embed);
            }
            return apa();
            }

            message.util!.send(embed);
    }
}