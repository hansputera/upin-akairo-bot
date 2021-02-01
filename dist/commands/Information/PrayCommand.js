"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
class PrayCommand extends discord_akairo_1.Command {
    constructor() {
        super('pray', {
            aliases: ['pray', 'prayschedule'],
            ratelimit: 3,
            editable: true,
            args: [{
                    id: "place",
                    type: "string",
                    match: 'rest',
                    prompt: {
                        start: "Please enter place name, (eg. Pandu Sanjaya)",
                        retry: "Please enter place name, (eg. Pandu Sanjaya)"
                    },
                }],
            channel: "guild",
            category: "information"
        });
    }
    async exec(message, { place }) {
        try {
            await message.util.reply('Please wait...');
            const { data } = await axios_1.default.get('https://sholat.kekmareborn.ga/cari/' + encodeURIComponent(place));
            if (!data.result)
                return message.util.send('I can\'t find that place!');
            const result = data.result[0];
            const embed = new discord_js_1.MessageEmbed()
                .setColor('RANDOM')
                .setTitle(place + ' Pray Schedule')
                .addField('Timezone', `${result.location.timezone.name} ${result.location.timezone.offset}`);
            let scheduleText = "";
            for (let i = 0; i < Object.keys(result.schedule).length; i++) {
                const key = Object.keys(result.schedule)[i];
                const val = Object.values(result.schedule)[i];
                scheduleText += `${i + 1}. ${key}: ${val}\n`;
            }
            embed.setDescription(scheduleText);
            message.util.send(embed);
        }
        catch (e) {
            message.util.send('Error: ' + e);
        }
    }
}
exports.default = PrayCommand;
