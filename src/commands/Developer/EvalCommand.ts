import { Command } from "discord-akairo";
import type { Message } from "discord.js";
import { inspect } from "util";

export default class EvalCommand extends Command {
    constructor() {
        super('eval', {
            aliases: ['ev', 'evaluate', 'eval'],
            ownerOnly: true,
            editable: true,
            category: "developer",
            args: [{
                id: "code",
                match: "content",
                prompt: {
                    start: "Please enter code to evaluate!",
                    retry: "Please enter code to evaluate!"
                }
            }, {
                id: "asyncFlag",
                match: "flag",
                flag: "--async"
            }]
        });
    }

    public async exec(message: Message, { code, asyncFlag, silent }: { code: string; asyncFlag: boolean; silent: boolean; }) {
        try {
            if (asyncFlag) code = `(async() => { ${code} })()`;
            code = eval(code);
            code = inspect(code, { depth: 0 });
            message.util!.reply(code, { code: "js" });
        } catch (e) {
            message.util!.reply(e, { code: "js" });
        }
    }
}