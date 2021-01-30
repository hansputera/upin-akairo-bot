import type Upin from "../Upin";
import type { IQueueData } from "../../interfaces/IMusic";
import { Player, TrackData } from "@lavacord/discord.js";

export default class Queue {
    constructor(private client: Upin, private data: IQueueData) {}

    public textChannel = this.data.textChannel;
    public voiceChannel = this.data.voiceChannel;
    public player?: Player = undefined;
    public songs?: TrackData[] = [];
    public volume = 100;
    public playing = true;
    public loop = false;
    public timeout?: NodeJS.Timeout;

    public setPlayer(player: Player) {
        this.player! = player;
    }
    public async pause() {
        if (!this.playing) return false;
        await this.player!.pause(true);
        this.playing = false;
        return true;
    }

    public async resume() {
        if (this.playing) return false;
        await this.player!.pause(false);
        this.playing = true;
        return true;
    }

    public async skip() {
        await this.player!.stop();
    }

    public async setVolume(newVol: number) {
        if (!newVol && isNaN(newVol)) return false;
        await this.player!.volume(newVol);
        this.volume = newVol;
        return true;
    }

    public async destroy() {
        this.client.musicManager.queue.delete(this.textChannel.guild.id);
        await this.client.musicManager.manager.leave(this.textChannel.guild.id);
    }
}