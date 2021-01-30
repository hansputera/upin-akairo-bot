import type { Snowflake } from "discord.js";
import WebSocket from "ws";
import MusicAPI from "../api/Music";
import Authorization from "../api/security/authorization";
import type { IAuthorizationPayload } from "../interfaces/IAuthorization";
import type Upin from "./Upin";
const wss = new WebSocket.Server({
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

export default class UpinWebsocket {
    constructor(private client: Upin) {
        this.wss.on('connection', async (ws) => {
            ws.on('MUSIC:getQueue', async (data: IAuthorizationPayload, guildId: Snowflake) => {
                if (!data.token) return ws.send('Missing user token!');
                if (!data.dateIn) return ws.send('Missing user dateIn!');
                if (typeof data.dateIn !== "number") return ws.send('Invalid user dateIn!');

                const authorization = new Authorization(data);
                const verified = await authorization.verify();
                if (!verified) return ws.send('Invalid token!');
                else ws.send(this.queueManager.getQueue(guildId));
            });
        });
    }
    public queueManager = new MusicAPI(this.client);
    public wss = wss;
};