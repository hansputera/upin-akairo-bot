import { VoiceChannel, TextChannel } from "discord.js";

export interface IQueueData {
    textChannel: TextChannel,
    voiceChannel: VoiceChannel
}