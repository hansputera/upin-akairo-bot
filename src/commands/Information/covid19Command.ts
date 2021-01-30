import axios from "axios";
import { Command } from "discord-akairo";
import type { Message } from "discord.js";
import { MessageEmbed } from "discord.js";

export default class covid19Command extends Command {
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
            }],
            category: "information"
        });
    }

    public async exec(message: Message, { country }: { country: string; }) {
        // using covid19.mathdroid.id
        const urls = {
            "base": `https://covid19.mathdro.id/api/countries/${encodeURIComponent(country)}`
        };
        try {
            const { data } = await axios.get(urls.base);
            const confirmed: number = data.confirmed.value;
            const recovered: number = data.recovered.value;
            const deaths: number = data.deaths.value;

            const recoveredPercent = ((recovered / confirmed) * 100).toFixed(2);
            const deathsPercent = ((deaths / confirmed) * 100).toFixed(2);

            const embed = new MessageEmbed()
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
            message.util!.send(embed);
        } catch {
            message.util!.reply('I can\'t find that country!');
        }
    }
}