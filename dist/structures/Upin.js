"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const path_1 = require("path");
const configuration_json_1 = __importDefault(require("../configuration.json"));
const PlaylistController_1 = __importDefault(require("../controllers/PlaylistController"));
const Database_1 = __importDefault(require("./Database"));
const Util_1 = __importDefault(require("./Util"));
const Websocket_1 = __importDefault(require("./Websocket"));
class Upin extends discord_akairo_1.AkairoClient {
    constructor(options, clientOptions) {
        super(options, clientOptions);
        this.nodeLavalink = "";
        this.wsUpin = new Websocket_1.default(this);
        this.playlist = new PlaylistController_1.default(this);
        this.db = Database_1.default;
        this.utility = new Util_1.default(this);
        this.configuration = configuration_json_1.default;
        this.commandHandler = new discord_akairo_1.CommandHandler(this, {
            directory: path_1.join(__dirname, '..', 'commands'),
            prefix: configuration_json_1.default.PREFIX,
            aliasReplacement: /-/g,
            allowMention: true,
            handleEdits: true,
            commandUtil: true,
            commandUtilLifetime: 3e5,
            defaultCooldown: 5000,
            storeMessages: true,
            argumentDefaults: {
                prompt: {
                    modifyStart: (_, str) => `${str}\n\nType \`cancel\` to cancel the commmand`,
                    modifyRetry: (_, str) => `${str}\n\nType \`cancel\` to cancel the commmand`,
                    timeout: "You took too long, the command has been cancelled now.",
                    ended: "You exceeded the maximum amout of trie, this command has now been cancelled.",
                    cancel: "This command has been cancelled now.",
                    retries: 3,
                    time: 30000
                },
                otherwise: ''
            }
        });
        this.listenerHandler = new discord_akairo_1.ListenerHandler(this, {
            directory: path_1.join(__dirname, '..', 'listeners')
        });
        this._init();
    }
    _init() {
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            listenerHandler: this.listenerHandler
        });
        this.listenerHandler.loadAll();
        this.commandHandler.loadAll();
    }
    build() {
        return this.login(configuration_json_1.default.TOKEN);
    }
}
exports.default = Upin;
