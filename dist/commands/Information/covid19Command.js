"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
class covid19Command extends discord_akairo_1.Command {
    constructor() {
        super('covid19', {
            aliases: ['covid-19', 'covidnineteen'],
            ratelimit: 3,
            args: [{
                    id: "country",
                    type: "string",
                    match: "content",
                    prompt: {
                        start: "Please enter country!",
                        retry: "Please enter country!"
                    }
                }]
        });
    }
    async exec(message, { country }) {
        // using covid19.mathdroid.id
        const urls = {
            "base": `https://covid19.mathdro.id/api/countries/${encodeURIComponent(country)}`
        };
        try {
            const { data } = await axios_1.default.get(urls.base);
            const confirmed = data.confirmed.value;
            const recovered = data.recovered.value;
            const deaths = data.deaths.value;
            const recoveredPercent = ((recovered / confirmed) * 100).toFixed(2);
            const deathsPercent = ((deaths / confirmed) * 100).toFixed(2);
            const embed = new discord_js_1.MessageEmbed()
                .setColor('RANDOM')
                .setTitle(`${country} COVID-19`)
                .setDescription(`
            Confirmed: ${confirmed.toLocaleString()}
            Recovered: ${recovered.toLocaleString()} | ${recoveredPercent}%
            Deaths: ${deaths.toLocaleString()} | ${deathsPercent}%
            `)
                .setImage('https://covid19.mathdro.id/api/og')
                .setFooter('(c) Mathdroid COVID19 API')
                .setTimestamp(new Date(data.lastUpdate));
            message.util.send(embed);
        }
        catch {
            message.util.reply('I can\'t find that country!');
        }
    }
}
exports.default = covid19Command;
