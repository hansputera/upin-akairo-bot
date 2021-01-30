import type { Snowflake } from "discord.js";

export interface IAuthorizationPayload {
    token: string;
    dateIn: number;
}

export interface IPayloadToken {    
    userId: Snowflake;
    sessionDate: number;
    email: string;
    _token: string;
}