"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(require("../structures/Database"));
class PlaylistController {
    constructor(client) {
        this.client = client;
        this.db = Database_1.default.firestore();
    }
    async create(userID, playlistName) {
        if ((await this.getPlaylist(playlistName, userID))) {
            return false;
        }
        else {
            await this.db.collection('playlists').add({
                name: playlistName,
                userID,
                tracks: [],
                date: Date.now()
            });
            return true;
        }
    }
    async addTrack(track, playlistName, userID) {
        const playlist = await this.getPlaylist(playlistName, userID);
        if (!playlist)
            return undefined;
        else {
            if (!playlist.data.tracks.length) {
                const track_ = {
                    trackID: Math.floor(Math.random() * 1000000000),
                    ...track
                };
                await this.db.collection('playlists').doc(playlist.id).update({
                    tracks: [track_]
                });
                return (await this.getPlaylist(playlistName, userID));
            }
            else {
                const tracks = playlist.data.tracks;
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
    async deletePlaylist(userID, playlistName) {
        const playlist = await this.getPlaylist(playlistName, userID);
        if (!playlist)
            return undefined;
        else {
            await this.db.collection('playlists').doc(playlist.id).delete();
            return playlist;
        }
    }
    async removeTrack(trackID, playlistName, userID) {
        const playlist = await this.getPlaylist(playlistName, userID);
        if (!playlist)
            return undefined;
        else {
            if (!playlist.data.tracks.length)
                return false;
            const tracks = playlist.data.tracks.filter(x => x.trackID !== trackID);
            if (tracks.length === playlist.data.tracks.length)
                return false;
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
    async getPlaylist(playlistName, userID) {
        const playlist = (await this.all()).find(pl => pl.data.name.toLowerCase() === playlistName.toLowerCase() && pl.data.userID === userID);
        if (!playlist)
            return undefined;
        else
            return playlist;
    }
    async all() {
        const snapshots = await this.db.collection('playlists').get();
        return snapshots.docs.map(x => ({ id: x.id, data: x.data() }));
    }
}
exports.default = PlaylistController;
