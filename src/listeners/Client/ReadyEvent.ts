import { Listener } from "discord-akairo";
import MusicHandler from "../../structures/Music/Handler";
import Upin from "../../structures/Upin";

export default class ReadyEvent extends Listener {
    public constructor(public client: Upin) {
        super("ready", {
            emitter: 'client',
            event: 'ready',
            category: 'client'
        });
    }

    public exec() {
        this.client.musicManager = new MusicHandler(this.client);
        this.client.utility.getRandomNode();
        console.log('I\'m ready!');
        this.client.user!.setActivity('Upin & Ipin');
    }
}