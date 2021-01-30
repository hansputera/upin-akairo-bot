"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("@lavacord/discord.js");
const discord_js_2 = require("discord.js");
const configuration_json_1 = __importDefault(require("../../configuration.json"));
const Queue_1 = __importDefault(require("./Queue"));
class MusicHandler {
    constructor(client) {
        this.client = client;
        this.manager = new discord_js_1.Manager(this.client, configuration_json_1.default.lavalink.nodes, {
            shards: this.client.shard ? this.client.shard.count : 1,
            user: this.client.user.id
        });
        this.queue = new discord_js_2.Collection();
        this.manager.connect();
    }
    async handleVideo(message, voiceChannel, song) {
        const serverQueue = this.queue.get(message.guild.id);
        song.requestedBy = message.author;
        this.client.wsUpin.wss.clients.forEach((ws) => {
            ws.emit(`MUSIC:${voiceChannel.guild.id}:newSong`, song);
        });
        if (!serverQueue) {
            const queue = new Queue_1.default(this.client, {
                textChannel: message.channel,
                voiceChannel
            });
            queue.songs.push(song);
            this.queue.set(message.guild.id, queue);
            try {
                const player = await this.manager.join({
                    channel: voiceChannel.id,
                    guild: message.guild.id,
                    node: this.client.nodeLavalink
                }, {
                    selfdeaf: true
                });
                queue.setPlayer(player);
                this.play(message.guild, song);
            }
            catch (error) {
                console.error(`I could not join the voice channel: ${error} ${error.stack}`);
                this.queue.delete(message.guild.id);
                this.manager.leave(message.guild.id);
                message.channel.send(`I could not join the voice channel: ${error.message}`);
            }
        }
        else {
            serverQueue.songs.push(song);
            const dur = this.client.utility.parseDur(song.info.length);
            const embed = new discord_js_2.MessageEmbed()
                .setColor("RANDOM")
                .setTitle("✅ Added to Queue")
                .addField("- Song Name:", song.info.title)
                .addField("- Channel", `**[${song.info.author}](${song.info.uri})**`)
                .addField("- Duration", `**${dur}**`)
                .addField("- Requester", song.requestedBy.username)
                .addField("- Loop", serverQueue.loop ? "**✅ Enable**" : "**❎ Disable**")
                .setImage(`http://i3.ytimg.com/vi/${song.info.identifier}/hqdefault.jpg`)
                .setTimestamp();
            serverQueue.textChannel.send(embed);
        }
    }
    play(guild, song) {
        const serverQueue = this.queue.get(guild.id);
        if (!song) {
            this.client.wsUpin.wss.clients.forEach((ws) => ws.emit(`MUSIC:${guild.id}:queueEmpty`, true));
            serverQueue.textChannel.send("**📣 Queue is empty! Leaving voice channel..**");
            this.manager.leave(guild.id);
            this.queue.delete(guild.id);
        }
        else {
            serverQueue.player.play(song.track);
            serverQueue.player.once('error', console.error)
                .once('end', data => {
                if (data.reason === "REPLACED")
                    return;
                const shifted = serverQueue.songs.shift();
                if (serverQueue.loop) {
                    serverQueue.songs.push(shifted);
                }
                this.play(guild, serverQueue.songs[0]);
            });
            serverQueue.player.volume(serverQueue.volume);
            let next;
            if (!serverQueue.songs[1])
                next = "**None**";
            else
                next = `**[${serverQueue.songs[1].info.title}](${serverQueue.songs[1].info.uri})**`;
            const dur = this.client.utility.parseDur(serverQueue.songs[0].info.length);
            const embed = new discord_js_2.MessageEmbed()
                .setColor('RANDOM')
                .setTitle("🎵 Now Playing")
                .setDescription(`
            Song: [${serverQueue.songs[0].info.title}](${serverQueue.songs[0].info.uri})
            Uploader: ${serverQueue.songs[0].info.author}
            Duration: ${dur}
            Loop: ${serverQueue.loop ? 'Enabled' : 'Disabled'}
            `)
                .addField('Requester', serverQueue.songs[0].requestedBy.tag)
                .addField('Voice Channel', serverQueue.voiceChannel.name)
                .addField('Next Queue', next)
                .setImage(`http://i3.ytimg.com/vi/${serverQueue.songs[0].info.identifier}/maxresdefault.jpg`);
            serverQueue.textChannel.send(embed);
        }
    }
    async getSongs(query) {
        const node = await this.manager.nodes.get(this.client.nodeLavalink);
        const result = await discord_js_1.Rest.load(node, query);
        return result.tracks;
    }
}
exports.default = MusicHandler;
