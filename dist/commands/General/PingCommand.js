"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class PingCommand extends discord_akairo_1.Command {
    constructor() {
        super('ping', {
            category: 'general',
            aliases: ['pung', 'ping'],
            ratelimit: 3,
            editable: true,
            channel: "guild"
        });
    }
    exec(message) {
        message.util?.send(`Pong! \`${this.client.ws.ping}ms\``);
    }
}
exports.default = PingCommand;
