import { LavalinkNode, Manager, Rest, TrackData } from "@lavacord/discord.js";
import { Collection, Message, VoiceChannel, TextChannel, Guild, MessageEmbed } from "discord.js";
import type Upin from "../Upin";
import config from "../../configuration.json";
import Queue from "./Queue";

export default class MusicHandler {
    constructor(private client: Upin) {
        this.manager.connect();
    }

    public manager: Manager = new Manager(this.client, config.lavalink.nodes, {
        shards: this.client.shard ? this.client.shard.count : 1,
        user: this.client.user!.id
    });
    public queue: Collection<string, Queue> = new Collection();

    public async handleVideo(message: Message, voiceChannel: VoiceChannel, song: TrackData) {
        const serverQueue = this.queue.get(message.guild!.id);
        (song as any).requestedBy = message.author;
        this.client.wsUpin.wss.clients.forEach((ws) => {
            ws.emit(`MUSIC:${voiceChannel.guild.id}:newSong`, song);
        });
        if (!serverQueue) {
            const queue = new Queue(this.client, {
                textChannel: message.channel as TextChannel,
                voiceChannel
            });
            queue.songs!.push(song);
            this.queue.set(message.guild!.id, queue);

            try {
                const player = await this.manager.join(
                    {
                        channel: voiceChannel.id,
                        guild: message.guild!.id,
                        node: this.client.nodeLavalink
                    }, {
                        selfdeaf: true
                    }
                );
                queue.setPlayer(player);
                this.play(message.guild!, song);
            } catch (error) {
                console.error(`I could not join the voice channel: ${error} ${error.stack}`);
                this.queue.delete(message.guild!.id);
                this.manager.leave(message.guild!.id);
                message.channel.send(
                    `I could not join the voice channel: ${error.message}`
                );
            }
        } else {
            serverQueue!.songs!.push(song);
            const dur = this.client.utility.parseDur(song.info.length);
            const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle("✅ Added to Queue")
            .addField("- Song Name:", song.info.title)
            .addField("- Channel", `**[${song.info.author}](${song.info.uri})**`)
            .addField("- Duration", `**${dur}**`)
            .addField("- Requester", (song as any).requestedBy.username)
            .addField(
            "- Loop",
            serverQueue.loop ? "**✅ Enable**" : "**❎ Disable**"
            )
            .setImage(
            `http://i3.ytimg.com/vi/${song.info.identifier}/hqdefault.jpg`
            )
            .setTimestamp();

            serverQueue.textChannel.send(embed);
        }
    }

    public play(guild: Guild, song?: TrackData) {
        const serverQueue = this.queue.get(guild.id);
        if (!song) {
            this.client.wsUpin.wss.clients.forEach((ws) => ws.emit(`MUSIC:${guild.id}:queueEmpty`, true));
            serverQueue!.textChannel.send("**📣 Queue is empty! Leaving voice channel..**");
            this.manager.leave(guild.id);
            this.queue.delete(guild.id);
        } else {
            serverQueue!.player!.play(song!.track);
            serverQueue!.player!.once('error', console.error)
            .once('end', data => {
                if (data.reason! === "REPLACED") return;
                const shifted = serverQueue!.songs!.shift();
                if (serverQueue!.loop) {
                    serverQueue!.songs!.push(shifted as TrackData);
                }
                this.play(guild, serverQueue!.songs![0]!);
            });
            serverQueue!.player!.volume(serverQueue!.volume);

            let next: string;
            if (!serverQueue!.songs![1]) next = "**None**";
            else next = `**[${serverQueue!.songs![1].info.title}](${serverQueue!.songs![1].info.uri})**`;
            const dur = this.client.utility.parseDur(serverQueue!.songs![0].info.length);

            const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle("🎵 Now Playing")
            .setDescription(`
            Song: [${serverQueue!.songs![0].info.title}](${serverQueue!.songs![0].info.uri})
            Uploader: ${serverQueue!.songs![0].info.author}
            Duration: ${dur}
            Loop: ${serverQueue!.loop ? 'Enabled' : 'Disabled'}
            `)
            .addField('Requester', (serverQueue!.songs![0] as any).requestedBy.tag)
            .addField('Voice Channel', serverQueue!.voiceChannel.name)
            .addField('Next Queue', next)
            .setImage(`http://i3.ytimg.com/vi/${serverQueue!.songs![0].info.identifier}/maxresdefault.jpg`);
            serverQueue!.textChannel.send(embed);
        }
    }

    public async getSongs(query: string) {
        const node = await this.manager.nodes.get(this.client.nodeLavalink);
        const result = await Rest.load(node as LavalinkNode, query);
        return result.tracks;
    }
}