import type { TrackData } from "@lavacord/discord.js";
import type { Snowflake } from "discord.js";

export interface IPlaylist {
    name: string;
    userID: Snowflake,
    tracks?: ITrack[];
    date: number;
}

export interface ITrack {
    info: TrackData['info'];
    track: TrackData['track'];
    trackID: number;
}