import { Command, version } from "discord-akairo";
import type { Message } from "discord.js";
import { MessageEmbed } from "discord.js";
import { arch, cpus } from "os";
import { memoryUsage } from "process";
import type Upin from "../../structures/Upin";

export default class StatsCommand extends Command {
    constructor(public client: Upin) {
        super('stats', {
            aliases: ['st', 'botinfo'],
            editable: true,
            args: [{
                id: "lava",
                match: "flag",
                flag: "--lavalink"
            }]
        });
    }

    public exec(message: Message, { lava }: { lava: boolean; }) {
        if (lava) {
            const embed = new MessageEmbed()
            .setColor('PURPLE')
            .setTitle('Lavalink Statistics')
            .setThumbnail("https://cdn.glitch.com/61fd2025-c1f6-49b5-825c-c6f729f6cbc0%2Fimages%20(5).jpeg?v=1587945353236")
            .setDescription(`
            Node: ${this.client.nodeLavalink}
            Status: ${this.client.musicManager.manager.nodes.get(this.client.nodeLavalink)!.connected ? "Connected" : "Disconnected"}
            Memory: ${(this.client.musicManager.manager.nodes.get(this.client.nodeLavalink)!.stats.memory.allocated / 1024 / 1024).toFixed(2)}/${(this.client.musicManager.manager.nodes.get(this.client.nodeLavalink)!.stats.memory.used / 1024 / 1024).toFixed(2)} MB
            Players: ${this.client.musicManager.manager.nodes.get(this.client.nodeLavalink)!.stats.players} Player(s)
            CPU Core: ${this.client.musicManager.manager.nodes.get(this.client.nodeLavalink)!.stats.cpu.cores} Core
            `)
            .setTimestamp();

            message.util!.send(embed);
        } else {

            const embed = new MessageEmbed()
            .setColor("BLUE")
            .setTitle('My Statistics')
            .setThumbnail(this.client.user!.displayAvatarURL()!)
            .addField('Bot', `
            - Name: ${this.client.user!.tag}
            - Version: v${version} Discord-Akairo (Discord.JS)
            `)
            .addField('Process', `
            Memory Usage: ${(memoryUsage().heapUsed / 2048 / 2048).toFixed(2)}MiB
            CPU: ${cpus()[0].model} ${arch()}
            `)
            .setTimestamp();

            message.util!.send(embed);
        }
    }
}