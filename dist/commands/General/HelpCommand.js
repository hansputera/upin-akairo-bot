"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
class HelpCommand extends discord_akairo_1.Command {
    constructor() {
        super('help', {
            aliases: ['h', 'halp', 'hulp'],
            ratelimit: 3,
            editable: true,
            args: [{
                    id: "command",
                    type: "commandAlias",
                    default: null
                }]
        });
    }
    exec(message, { command }) {
        if (command) {
            const embed = new discord_js_1.MessageEmbed()
                .setAuthor(`Help | ${this.client.user.tag}`, this.client.user.displayAvatarURL())
                .setColor("RANDOM")
                .setThumbnail(this.client.user.displayAvatarURL({ size: 2048, format: "png" }))
                .addField('Name', command.id)
                .addField('Aliases', command.aliases)
                .addField('Editable/Ratelimit', `${command.editable ? "Yes" : "No"}/${command.ratelimit}`)
                .setTimestamp();
            message.util.send(embed);
        }
        const embed = new discord_js_1.MessageEmbed()
            .setAuthor(`Help | ${this.client.user.tag}`, this.client.user.displayAvatarURL())
            .setColor("RANDOM")
            .setThumbnail(this.client.user.displayAvatarURL({ size: 2048, format: "png" }))
            .setTimestamp();
        for (const category of this.handler.categories.values()) {
            if (/default/gi.exec(category.id))
                return;
            embed.addField(category.id, category.filter(cmd => cmd.aliases.length > 0).map(cmd => `**\`${cmd.id}\`**`).join(" | "));
        }
        return message.util.send(embed);
    }
}
exports.default = HelpCommand;
