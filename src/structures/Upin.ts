import { AkairoClient, AkairoOptions, CommandHandler, ListenerHandler } from "discord-akairo";
import type { ClientOptions } from "discord.js";
import { join } from "path";
import config from "../configuration.json";
import PlaylistController from "../controllers/PlaylistController";
import Database from "./Database";
import MusicHandler from "./Music/Handler";
import Util from "./Util";
import UpinWebsocket from "./Websocket";

export default class Upin extends AkairoClient {
    constructor(options?: AkairoOptions, clientOptions?: ClientOptions) {
        super(options, clientOptions);

        this._init();
    }
    
    public nodeLavalink = "";
    public wsUpin = new UpinWebsocket(this);
    public playlist: PlaylistController = new PlaylistController(this);
    public db: typeof Database = Database;
    musicManager!: MusicHandler;
    public utility: Util = new Util(this);
    readonly configuration = config;
    public commandHandler: CommandHandler = new CommandHandler(this, {
        directory: join(__dirname, '..', 'commands'),
        prefix: config.PREFIX,
        aliasReplacement: /-/g,
        allowMention: true,
        handleEdits: true,
        commandUtil: true,
        commandUtilLifetime: 3e5,
        defaultCooldown: 5000,
        storeMessages: true,
        argumentDefaults: {
            prompt: {
                modifyStart: (_, str): string => `${str}\n\nType \`cancel\` to cancel the commmand`,
                modifyRetry: (_, str): string => `${str}\n\nType \`cancel\` to cancel the commmand`,
                timeout: "You took too long, the command has been cancelled now.",
                ended: "You exceeded the maximum amout of trie, this command has now been cancelled.",
                cancel: "This command has been cancelled now.",
                retries: 3,
                time: 30000
            },
            otherwise: ''
        }
    });

    public listenerHandler: ListenerHandler = new ListenerHandler(this, {
        directory: join(__dirname, '..', 'listeners')
    });

    public _init(): void {
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            listenerHandler: this.listenerHandler
        });
        this.listenerHandler.loadAll();
        this.commandHandler.loadAll();
    }

    public build() {
        return this.login(config.TOKEN);
    }
}