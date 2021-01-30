import db from "../../structures/Database";
const firestore = db.firestore();
import { verify, sign } from "jsonwebtoken";
import type { IAuthorizationPayload, IPayloadToken } from "../../interfaces/IAuthorization";
import config from "../../configuration.json";
import type { Snowflake } from "discord.js";

export default class Authorization {
    constructor(private authorizationPayload: IAuthorizationPayload) {}

    public async verify() {
        try {
            const data = verify(this.authorizationPayload.token, config.secretAuthorization, {
                algorithms: ['RS384']
            }) as IPayloadToken;
            const is = await this.getToken(data._token);
            if (!is) return false;
            return data;
        } catch {
            return false;
        }
    }

    public async create(userID: Snowflake, email: string) {
        const user = {
            userId: userID,
            sessionDate: Date.now(),
            email
        };
        let token_: string | undefined;

        if ((await this.getUserID(userID))) return false;

        sign(user, config.secretAuthorization, {
            algorithm: "RS384",
            encoding: "utf-8"
        }, async (err, token) => {
            if (err) throw Error(err.message);
            const payload: IPayloadToken = {
                ...user,
                _token: token!
            };
            await firestore.collection('websites').add(payload);
            token_ = token!;
        });
        return (await this.getToken(token_)) as { id: string; data: IPayloadToken; };
    }

    private async getUserID(userId: Snowflake) {
        return (await this.allTokens()).find(obj => obj.data.userId === userId);
    }
    private async getToken(token?: string) {
        if (!token) token = this.authorizationPayload.token;
        return (await this.allTokens()).find(obj => obj.data._token === token);
    }

    private async allTokens() {
        const snapshots = await firestore.collection('websites').get();
        return snapshots.docs.map(x => ({ id: x.id, data: x.data() as IPayloadToken }));
    }
}