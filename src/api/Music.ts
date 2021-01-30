import type { Snowflake } from "discord.js";
import type Upin from "../structures/Upin";

export default class MusicAPI {
    constructor(private client: Upin) {}
    
    public getQueue(guildId: Snowflake) {
        const queue = this.client.musicManager.queue.get(guildId);
        if (!queue) return undefined;
        else return queue;
    }

    public async destroyQueue(guildId: Snowflake, userID: Snowflake) {
        const queue = this.getQueue(guildId);
        if (!queue) return false;
        if (!queue!.voiceChannel.members.find(m => m.id === userID)) return false;
        await queue!.destroy();
        return true;
    }

    public async skipTrack(guildId: Snowflake, userID: Snowflake) {
        const queue = this.getQueue(guildId);
        if (!queue) return false;
        if (!queue!.voiceChannel.members.find(m => m.id === userID)) return false;
        await queue.skip();
        return true;
    }

    public async pauseQueue(guildId: Snowflake, userID: Snowflake) {
        const queue = this.getQueue(guildId);
        if (!queue) return false;
        if (!queue!.voiceChannel.members.find(m => m.id === userID)) return false;
        await queue.pause();
        return true;
    }

    public async resumeQueue(guildId: Snowflake, userID: Snowflake) {
        const queue = this.getQueue(guildId);
        if (!queue) return false;
        if (!queue!.voiceChannel.members.find(m => m.id === userID)) return false;
        await queue.resume();
        return true;
    }
}