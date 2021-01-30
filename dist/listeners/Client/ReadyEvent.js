"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const Handler_1 = __importDefault(require("../../structures/Music/Handler"));
class ReadyEvent extends discord_akairo_1.Listener {
    constructor(client) {
        super("ready", {
            emitter: 'client',
            event: 'ready',
            category: 'client'
        });
        this.client = client;
    }
    exec() {
        this.client.musicManager = new Handler_1.default(this.client);
        this.client.utility.getRandomNode();
        console.log('I\'m ready!');
        this.client.user.setActivity('Upin & Ipin');
    }
}
exports.default = ReadyEvent;
