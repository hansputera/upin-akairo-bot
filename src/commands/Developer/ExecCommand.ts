import { exec } from "child_process";
import { Command } from "discord-akairo";
import type { Message } from "discord.js";

export default class ExecCommand extends Command {
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

    public exec(message: Message, { argument }: { argument: string; }) {
        exec(argument, (error, stdout, stderr) => {
            if (error || stderr) return message.util!.reply(error!.message || stderr, { code: "sh" });
            else message.util!.reply(stdout, { code: "sh" });
        });
    }
}