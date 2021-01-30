"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MusicAPI {
    constructor(client) {
        this.client = client;
    }
    getQueue(guildId) {
        const queue = this.client.musicManager.queue.get(guildId);
        if (!queue)
            return undefined;
        else
            return queue;
    }
    async destroyQueue(guildId, userID) {
        const queue = this.getQueue(guildId);
        if (!queue)
            return false;
        if (!queue.voiceChannel.members.find(m => m.id === userID))
            return false;
        await queue.destroy();
        return true;
    }
    async skipTrack(guildId, userID) {
        const queue = this.getQueue(guildId);
        if (!queue)
            return false;
        if (!queue.voiceChannel.members.find(m => m.id === userID))
            return false;
        await queue.skip();
        return true;
    }
    async pauseQueue(guildId, userID) {
        const queue = this.getQueue(guildId);
        if (!queue)
            return false;
        if (!queue.voiceChannel.members.find(m => m.id === userID))
            return false;
        await queue.pause();
        return true;
    }
    async resumeQueue(guildId, userID) {
        const queue = this.getQueue(guildId);
        if (!queue)
            return false;
        if (!queue.voiceChannel.members.find(m => m.id === userID))
            return false;
        await queue.resume();
        return true;
    }
}
exports.default = MusicAPI;
