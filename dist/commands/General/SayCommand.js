"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class SayCommand extends discord_akairo_1.Command {
    constructor() {
        super('say', {
            aliases: ['said', 'say'],
            ratelimit: 3,
            editable: true,
            args: [{
                    id: "say",
                    match: "rest",
                    prompt: {
                        start: "Say something!",
                        retry: "Say something!"
                    }
                }],
            clientPermissions: ['SEND_MESSAGES', 'MANAGE_MESSAGES'],
            category: "general"
        });
    }
    exec(message, { say }) {
        message.delete();
        message.util.send(say);
    }
}
exports.default = SayCommand;
