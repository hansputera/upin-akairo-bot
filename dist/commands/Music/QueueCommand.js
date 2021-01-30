"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
class QueueCommand extends discord_akairo_1.Command {
    constructor(client) {
        super('queue', {
            aliases: ['queue', 'q'],
            editable: true
        });
        this.client = client;
    }
    async exec(message) {
        const queue = this.client.musicManager.queue.get(message.guild.id);
        if (!queue)
            return message.util.reply('Nothing queue');
        const embed = new discord_js_1.MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(`${message.guild.name} Queue`, message.guild.iconURL() ? message.guild.iconURL() : this.client.user.displayAvatarURL())
            .setTimestamp();
        if (queue.songs.length < 2)
            embed.setDescription(`1. ${queue.songs[0].info.title}`);
        else {
            let index = 0;
            let songs_ = queue.songs.sort().map((x, i) => `\`${i + 1}.\` - ${x.info.title}`);
            let songs = this.client.utility.chunk(songs_, 5);
            const embed = new discord_js_1.MessageEmbed()
                .setTitle('Currently Queue')
                .setDescription(songs[index].join('\n'))
                .setFooter(`[${index + 1}/${songs.length}] Currently playing ${queue.songs[0].info.title}`, `http://i3.ytimg.com/vi/${queue.songs[0].info.identifier}/hqdefault.jpg`)
                .setColor('RANDOM');
            let m = await message.util.send(embed);
            m.react('◀');
            m.react('🔴');
            m.react('▶');
            async function apa() {
                let filter = (rect, usr) => ['◀', '🔴', '▶'].includes(rect.emoji.name) && usr.id === message.author.id;
                let res = await m.awaitReactions(filter, {
                    max: 1,
                    time: 30 * 1000
                });
                if (!res.size)
                    return undefined;
                let emoji = res.first().emoji.name;
                if (emoji === '◀')
                    index--;
                if (emoji === '🔴')
                    m.delete();
                if (emoji === '▶')
                    index++;
                index = ((index % songs.length) + songs.length) % songs.length;
                embed.setDescription(songs[index].join('\n'));
                embed.setFooter(`[${index + 1}/${songs.length}] Currently playing ${queue.songs[0].info.title}`, 'http://i3.ytimg.com/vi/' + queue.songs[0].info.identifier + '/hqdefault.jpg');
                m.edit(embed);
            }
            return apa();
        }
        message.util.send(embed);
    }
}
exports.default = QueueCommand;
