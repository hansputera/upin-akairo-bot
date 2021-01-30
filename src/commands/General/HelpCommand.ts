import { Command } from "discord-akairo";
import type { Message } from "discord.js";
import { MessageEmbed } from "discord.js";
import type Upin from "../../structures/Upin";

export default class HelpCommand extends Command {
    constructor(public client: Upin) {
        super('help', {
            aliases: ['h', 'halp', 'hulp'],
            ratelimit: 3,
            editable: true,
            args: [{
                id: "command",
                type: "commandAlias",
                default: null
            }],
            category: "general"
        });
    }

    public exec(message: Message, { command }: { command: Command }) {
        if (command) {
            const embed = new MessageEmbed()
            .setAuthor(`Help | ${this.client.user!.tag}`, this.client.user!.displayAvatarURL())
            .setColor("RANDOM")
            .setThumbnail(this.client.user!.displayAvatarURL({ size: 2048, format: "png" }))   
            .addField('Name', command.id)
            .addField('Aliases', command.aliases)
            .addField('Editable/Ratelimit', `${command.editable ? "Yes": "No"}/${command.ratelimit}`)
            .setTimestamp();

            message.util!.send(embed);
        }

        const embed = new MessageEmbed()
            .setAuthor(`Help | ${this.client.user!.tag}`, this.client.user!.displayAvatarURL())
            .setColor("RANDOM")
            .setThumbnail(this.client.user!.displayAvatarURL({ size: 2048, format: "png" }))
            .setTimestamp();

        for (const category of this.handler.categories.values()) {
            if (/default/gi.exec(category.id)) return;
            embed.addField(this.client.utility.toTitleCase(category.id), category.filter(cmd => cmd.aliases.length > 0).map(cmd => `**\`${cmd.id}\`**`).join(" | "));
        }
        return message.util!.send(embed);
    }
}