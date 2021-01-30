"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
class NowPlayingCommand extends discord_akairo_1.Command {
    constructor(client) {
        super('nowplaying', {
            aliases: ['np', 'nowplaying'],
            ratelimit: 3,
            editable: true,
            category: "music"
        });
        this.client = client;
    }
    async exec(message) {
        const queue = this.client.musicManager.queue.get(message.guild.id);
        if (!queue)
            return message.util.reply('Nothing queue!');
        const embed = new discord_js_1.MessageEmbed()
            .setAuthor(`${message.guild.name} Queue`, message.guild.iconURL() ? message.guild.iconURL() : this.client.user?.displayAvatarURL())
            .setDescription(`
        Song: [${queue.songs[0].info.title}](${queue.songs[0].info.uri})
        Duration: ${this.client.utility.parseDur(queue.songs[0].info.length)}
        Uploader: ${queue.songs[0].info.author}
        Requester: ${queue.songs[0].requestedBy.tag}
        `)
            .setImage(`http://i3.ytimg.com/vi/${queue.songs[0].info.identifier}/hqdefault.jpg`)
            .setTimestamp();
        message.util.send(embed);
    }
}
exports.default = NowPlayingCommand;
