"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const pretty_ms_1 = __importDefault(require("pretty-ms"));
class Util {
    constructor(client) {
        this.client = client;
    }
    async hastebin(text) {
        if (!text.length)
            throw Error('Invalid text');
        const { data } = await axios_1.default.post('https://bin.hansputera.me/documents', {
            "data": text
        });
        return "https://bin.hansputera.me/" + data.key;
    }
    parseDur(ms) {
        return pretty_ms_1.default(ms, {
            colonNotation: true,
            secondsDecimalDigits: 0
        });
    }
    chunk(arr, size) {
        const temp = [];
        for (var i = 0; i < arr.length; i += size) {
            temp.push(arr.slice(i, i + size));
        }
        return temp;
    }
    toTitleCase(str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }
    getRandomIndex() {
        return Math.floor(Math.random() * this.client.configuration.lavalink.nodes.length);
    }
    getRandomNode() {
        const node = this.client.configuration.lavalink.nodes[this.getRandomIndex()];
        const nodeManager = this.client.musicManager.manager.nodes.get(node.id);
        if (nodeManager.connected)
            this.client.nodeLavalink = node.id;
        else
            this.client.nodeLavalink = "aqua-lavalink";
        return { node, nodeManager };
    }
}
exports.default = Util;
