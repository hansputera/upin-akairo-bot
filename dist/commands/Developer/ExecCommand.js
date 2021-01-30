"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const discord_akairo_1 = require("discord-akairo");
class ExecCommand extends discord_akairo_1.Command {
    constructor() {
        super('exec', {
            aliases: ['ex', 'exec'],
            editable: true,
            args: [{
                    id: "argument",
                    match: 'rest',
                    prompt: {
                        start: "Please enter bash command!",
                        retry: "Please enter bash command!"
                    }
                }],
            ownerOnly: true,
            category: "developer"
        });
    }
    exec(message, { argument }) {
        child_process_1.exec(argument, (error, stdout, stderr) => {
            if (error || stderr)
                return message.util.reply(error.message || stderr, { code: "sh" });
            else
                message.util.reply(stdout, { code: "sh" });
        });
    }
}
exports.default = ExecCommand;
