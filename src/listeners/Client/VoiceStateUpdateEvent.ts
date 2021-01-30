import { Listener } from "discord-akairo";
import type { VoiceState, Collection, GuildMember } from "discord.js";
import { MessageEmbed } from "discord.js";
import type Queue from "../../structures/Music/Queue";
import type Upin from "../../structures/Upin";

export default class VoiceStateUpdateEvent extends Listener {
    constructor(public client: Upin) {
        super('voiceStateUpdate', {
            event: 'voiceStateUpdate',
            emitter: 'client',
            category: 'client'
        });
    }

    public doTimeout(vc: Collection<string, GuildMember>, queue: Queue) {
        if (vc.size === 0) {
            clearTimeout(queue.timeout!);
            queue.timeout = undefined;
            queue.pause();
            queue.textChannel.send({
                embed: {
                    color: 0x03ab,
                    title: "⏸ Queue paused",
                    description: "The voice channel is empty, If there no one joins to my channel in the next **1 minute**, the queue will be deleted!"
                  }
            });

            return queue.timeout = setTimeout(() => {
                const embed = new MessageEmbed()
                .setColor('#FF0000')
                .setDescription('**1 minute** have passed and there is no one joins my voice channel, queue will be deleted.')
                .setTitle('⏹ Queue Deleting');
                queue.textChannel.send(embed).then(msg => {
                    queue.destroy();
                    msg.edit(new MessageEmbed().setColor('#FFF300').setTitle('⏹ Queue Deleted').setDescription('Queue was deleted because no one joins my voice channel!'));
                });
            }, 60 * 1000);
        }
    }

    public resumeTimeout(vc: Collection<string, GuildMember>, queue: Queue) {
        if (vc.size > 0) {
            if (vc.size === 1) { clearTimeout(queue.timeout!); queue.timeout = undefined; }
            if (!queue.playing && vc.size < 2) {
                const song = queue.songs![0];
                queue.textChannel.send(new MessageEmbed()
                .setColor('#00BDFF')
                .setDescription(`Someone has joins the voice channel!\n🎶 Playing **[${song.info.title}](${song.info.uri})**`)
                .setAuthor('▶ Queue Resumed', 'https://www.flaticon.com/svg/static/icons/svg/2907/2907253.svg')
                .setThumbnail(`https://i3.ytimg.com/vi/${song.info.identifier}/hqdefault.jpg`)
                );
                queue.resume();
            }
        }
    }

    public async exec(oldState: VoiceState, newState: VoiceState) {
        const queue = this.client.musicManager.queue.get(newState.guild.id);
        if (!queue) return;

        const oldID = oldState.channelID ? oldState.channelID : undefined;
        const newID = newState.channelID ? newState.channelID : undefined;
        const vcID = queue!.voiceChannel.id;

        if (oldState.id === this.client.user!.id && oldID === queue!.voiceChannel.id && newID === undefined) {
            queue!.textChannel.send({
                embed: {
                    title: "Disconnected.",
                    description: "I'm just disconnected from voice channel, the queue will be deleted!",
                    color: 0xe6ac
                  }
            });
        }

        if (oldState.member!.user.id === this.client.user!.id && oldID === vcID && newID !== vcID) {
            const voice = newState.channel!.members.filter(m => !m.user.bot);
            if (voice.size === 0 && !queue.timeout) this.doTimeout(voice, queue);

            this.resumeTimeout(voice, queue);
            queue.voiceChannel = newState.channel!;
        }

        const vc = queue.voiceChannel.members.filter(m => !m.user.bot);

        if (oldID === vcID && newID !== vcID && !newState.member!.user.bot && !queue.timeout) {
            this.doTimeout(vc, queue);
        }
        if (newID === vcID && !newState.member!.user.bot) {
            this.resumeTimeout(vc, queue);
        }
    }
}