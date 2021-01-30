import { Command, Listener } from "discord-akairo";
import { Message } from "discord.js";
import Upin from "../../structures/Upin";

export default class CommandStarted extends Listener {
    public constructor(public client: Upin) {
        super('commandStarted', {
			event: 'commandStarted',
			emitter: 'commandHandler',
			category: 'commandHandler'
		});
    }

    public exec(message: Message, command?: Command) {
        if (command!.description!.maintenance && message.author.id !== this.client.ownerID) return message.reply(`${command!.id} has maintenance because: \`${command!.description!.maintenance}\``);
        console.log(message.author.tag, 'using', command!.id, 'in', message.guild!.name);
    }
}