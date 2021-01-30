import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class PingCommand extends Command {
    constructor() {
        super('ping', {
            category: 'general',
            aliases: ['pung', 'ping'],
            ratelimit: 3,
            editable: true,
            channel: "guild"
        });
    }

    public exec(message: Message) {
        message.util?.send(`Pong! \`${this.client.ws.ping}ms\``);
    }
}