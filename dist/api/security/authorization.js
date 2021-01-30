"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(require("../../structures/Database"));
const firestore = Database_1.default.firestore();
const jsonwebtoken_1 = require("jsonwebtoken");
const configuration_json_1 = __importDefault(require("../../configuration.json"));
class Authorization {
    constructor(authorizationPayload) {
        this.authorizationPayload = authorizationPayload;
    }
    async verify() {
        try {
            const data = jsonwebtoken_1.verify(this.authorizationPayload.token, configuration_json_1.default.secretAuthorization, {
                algorithms: ['RS384']
            });
            const is = await this.getToken(data._token);
            if (!is)
                return false;
            return data;
        }
        catch {
            return false;
        }
    }
    async create(userID, email) {
        const user = {
            userId: userID,
            sessionDate: Date.now(),
            email
        };
        let token_;
        if ((await this.getUserID(userID)))
            return false;
        jsonwebtoken_1.sign(user, configuration_json_1.default.secretAuthorization, {
            algorithm: "RS384",
            encoding: "utf-8"
        }, async (err, token) => {
            if (err)
                throw Error(err.message);
            const payload = {
                ...user,
                _token: token
            };
            await firestore.collection('websites').add(payload);
            token_ = token;
        });
        return (await this.getToken(token_));
    }
    async getUserID(userId) {
        return (await this.allTokens()).find(obj => obj.data.userId === userId);
    }
    async getToken(token) {
        if (!token)
            token = this.authorizationPayload.token;
        return (await this.allTokens()).find(obj => obj.data._token === token);
    }
    async allTokens() {
        const snapshots = await firestore.collection('websites').get();
        return snapshots.docs.map(x => ({ id: x.id, data: x.data() }));
    }
}
exports.default = Authorization;
