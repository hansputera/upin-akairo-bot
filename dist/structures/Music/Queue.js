"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Queue {
    constructor(client, data) {
        this.client = client;
        this.data = data;
        this.textChannel = this.data.textChannel;
        this.voiceChannel = this.data.voiceChannel;
        this.player = undefined;
        this.songs = [];
        this.volume = 100;
        this.playing = true;
        this.loop = false;
    }
    setPlayer(player) {
        this.player = player;
    }
    async pause() {
        if (!this.playing)
            return false;
        await this.player.pause(true);
        this.playing = false;
        return true;
    }
    async resume() {
        if (this.playing)
            return false;
        await this.player.pause(false);
        this.playing = true;
        return true;
    }
    async skip() {
        await this.player.stop();
    }
    async setVolume(newVol) {
        if (!newVol && isNaN(newVol))
            return false;
        await this.player.volume(newVol);
        this.volume = newVol;
        return true;
    }
    async destroy() {
        this.client.musicManager.queue.delete(this.textChannel.guild.id);
        await this.client.musicManager.manager.leave(this.textChannel.guild.id);
    }
}
exports.default = Queue;
