"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class CommandStarted extends discord_akairo_1.Listener {
    constructor(client) {
        super('commandStarted', {
            event: 'commandStarted',
            emitter: 'commandHandler',
            category: 'commandHandler'
        });
        this.client = client;
    }
    exec(message, command) {
        if (command.description.maintenance && message.author.id !== this.client.ownerID)
            return message.reply(`${command.id} has maintenance because: \`${command.description.maintenance}\``);
        console.log(message.author.tag, 'using', command.id, 'in', message.guild.name);
    }
}
exports.default = CommandStarted;
