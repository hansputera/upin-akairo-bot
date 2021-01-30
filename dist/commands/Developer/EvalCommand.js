"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const util_1 = require("util");
class EvalCommand extends discord_akairo_1.Command {
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
    async exec(message, { code, asyncFlag, silent }) {
        try {
            if (asyncFlag)
                code = `(async() => { ${code} })()`;
            code = eval(code);
            code = util_1.inspect(code, { depth: 0 });
            message.util.reply(code, { code: "js" });
        }
        catch (e) {
            message.util.reply(e, { code: "js" });
        }
    }
}
exports.default = EvalCommand;
