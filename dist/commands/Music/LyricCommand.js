"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
class LyricCommand extends discord_akairo_1.Command {
    constructor() {
        super('lyric', {
            aliases: ['lyrics'],
            editable: true,
            ratelimit: 1,
            args: [
                {
                    id: "song",
                    match: "rest",
                    prompt: {
                        start: "Please enter song title!",
                        retry: "Please enter song title!"
                    }
                }
            ]
        });
    }
    async exec(message, { song }) {
        const awaitMessage = await message.channel.send('Please wait!');
        const { data } = await axios_1.default.get(`https://api.hansputera.me/lyrics/${encodeURIComponent(song)}`);
        if (!data.success)
            return awaitMessage.edit('I can\'t find that song lyric!');
        const lyric = data.results[0];
        const embed = new discord_js_1.MessageEmbed()
            .setColor('RED')
            .setAuthor(`${lyric.title} Lyric`, lyric.picture)
            .setURL(lyric.url)
            .setDescription(lyric.lyric)
            .setThumbnail(lyric.picture)
            .setFooter('(c) Musixmatch', lyric.picture)
            .setTimestamp();
        awaitMessage.delete();
        message.util.send(embed);
    }
}
exports.default = LyricCommand;
