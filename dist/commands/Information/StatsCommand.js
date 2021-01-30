"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
const os_1 = require("os");
const process_1 = require("process");
class StatsCommand extends discord_akairo_1.Command {
    constructor(client) {
        super('stats', {
            aliases: ['st', 'botinfo'],
            editable: true,
            args: [{
                    id: "lava",
                    match: "flag",
                    flag: "--lavalink"
                }]
        });
        this.client = client;
    }
    exec(message, { lava }) {
        if (lava) {
            const embed = new discord_js_1.MessageEmbed()
                .setColor('PURPLE')
                .setTitle('Lavalink Statistics')
                .setThumbnail("https://cdn.glitch.com/61fd2025-c1f6-49b5-825c-c6f729f6cbc0%2Fimages%20(5).jpeg?v=1587945353236")
                .setDescription(`
            Node: ${this.client.nodeLavalink}
            Status: ${this.client.musicManager.manager.nodes.get(this.client.nodeLavalink).connected ? "Connected" : "Disconnected"}
            Memory: ${(this.client.musicManager.manager.nodes.get(this.client.nodeLavalink).stats.memory.allocated / 1024 / 1024).toFixed(2)}/${(this.client.musicManager.manager.nodes.get(this.client.nodeLavalink).stats.memory.used / 1024 / 1024).toFixed(2)} MB
            Players: ${this.client.musicManager.manager.nodes.get(this.client.nodeLavalink).stats.players} Player(s)
            CPU Core: ${this.client.musicManager.manager.nodes.get(this.client.nodeLavalink).stats.cpu.cores} Core
            `)
                .setTimestamp();
            message.util.send(embed);
        }
        else {
            const embed = new discord_js_1.MessageEmbed()
                .setColor("BLUE")
                .setTitle('My Statistics')
                .setThumbnail(this.client.user.displayAvatarURL())
                .addField('Bot', `
            - Name: ${this.client.user.tag}
            - Version: v${discord_akairo_1.version} Discord-Akairo (Discord.JS)
            `)
                .addField('Process', `
            Memory Usage: ${(process_1.memoryUsage().heapUsed / 2048 / 2048).toFixed(2)}MiB
            CPU: ${os_1.cpus()[0].model} ${os_1.arch()}
            `)
                .setTimestamp();
            message.util.send(embed);
        }
    }
}
exports.default = StatsCommand;
