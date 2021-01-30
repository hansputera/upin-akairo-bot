import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class SayCommand extends Command {
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

    public exec(message: Message, { say }: { say: string; }) {
        message.delete();
        message.util!.send(say);
    }
}