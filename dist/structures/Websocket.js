"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const Music_1 = __importDefault(require("../api/Music"));
const authorization_1 = __importDefault(require("../api/security/authorization"));
const wss = new ws_1.default.Server({
    port: 8080,
    clientTracking: true,
    perMessageDeflate: {
        clientNoContextTakeover: true,
        serverNoContextTakeover: true,
        serverMaxWindowBits: 10,
        concurrencyLimit: 10,
        threshold: 10
    }
});
class UpinWebsocket {
    constructor(client) {
        this.client = client;
        this.queueManager = new Music_1.default(this.client);
        this.wss = wss;
        this.wss.on('connection', async (ws) => {
            ws.on('MUSIC:getQueue', async (data, guildId) => {
                if (!data.token)
                    return ws.send('Missing user token!');
                if (!data.dateIn)
                    return ws.send('Missing user dateIn!');
                if (typeof data.dateIn !== "number")
                    return ws.send('Invalid user dateIn!');
                const authorization = new authorization_1.default(data);
                const verified = await authorization.verify();
                if (!verified)
                    return ws.send('Invalid token!');
                else
                    ws.send(this.queueManager.getQueue(guildId));
            });
        });
    }
}
exports.default = UpinWebsocket;
;
