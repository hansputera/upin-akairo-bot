import type Upin from "../structures/Upin";
import db from "../structures/Database";
import { Snowflake } from "discord.js";
import type { IPlaylist, ITrack } from "../interfaces/IPlaylist";
import type { TrackData } from "@lavacord/discord.js";

export default class PlaylistController {
    public db = db.firestore();
    constructor(private client: Upin) {}

    public async create(userID: Snowflake, playlistName: string) {
        if ((await this.getPlaylist(playlistName, userID))) {
            return false;
        } else {
            await this.db.collection('playlists').add({
                name: playlistName,
                userID,
                tracks: [],
                date: Date.now()
            });
            return true;
        }
    }

    public async addTrack(track: TrackData, playlistName: string, userID: Snowflake) {
        const playlist = await this.getPlaylist(playlistName, userID);
        if (!playlist) return undefined;
        else {
            if (!playlist.data.tracks!.length) {
                const track_: ITrack = {
                    trackID: Math.floor(Math.random() * 1000000000),
                    ...track
                };
                await this.db.collection('playlists').doc(playlist.id).update({
                    tracks: [track_]
                });
                return (await this.getPlaylist(playlistName, userID));
            } else {
                const tracks = playlist.data.tracks!;
                tracks.push({
                    trackID: Math.floor(Math.random() * 1000000000),
                    ...track
                });
                await this.db.collection('playlists').doc(playlist.id).update({
                    tracks
                });
                return (await this.getPlaylist(playlistName, userID));
            }
        }
    }

    public async deletePlaylist(userID: Snowflake, playlistName: string) {
        const playlist = await this.getPlaylist(playlistName, userID);
        if (!playlist) return undefined;
        else {
            await this.db.collection('playlists').doc(playlist.id).delete();
            return playlist;
        }
    }

    public async removeTrack(trackID: number, playlistName: string, userID: Snowflake) {
        const playlist = await this.getPlaylist(playlistName, userID);
        if (!playlist) return undefined;
        else {
            if (!playlist.data.tracks!.length) return false;

            const tracks = playlist.data.tracks!.filter(x => x.trackID !== trackID);
            if (tracks.length === playlist.data.tracks!.length) return false;
            if (tracks === []) {
                await this.db.collection('playlists').doc(playlist.id).update({
                    tracks: undefined
                });
                return (await this.getPlaylist(playlistName, userID));
            }
            await this.db.collection('playlists').doc(playlist.id).update({
                tracks
            });
            return (await this.getPlaylist(playlistName, userID));
        }
    }

    public async getPlaylist(playlistName: string, userID: Snowflake) {
        const playlist = (await this.all()).find(pl => pl.data.name.toLowerCase() === playlistName.toLowerCase() && pl.data.userID === userID);
        if (!playlist) return undefined;
        else return playlist;
    }

    public async all() {
        const snapshots = await this.db.collection('playlists').get();
        return snapshots.docs.map(x => ({ id: x.id, data: x.data() as IPlaylist }));
    }
}