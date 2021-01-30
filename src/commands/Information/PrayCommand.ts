import axios from "axios";
import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { Message } from "discord.js";

export default class PrayCommand extends Command {
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
                    infinite: true,
                    start: "Please enter place name, (eg. Pandu Sanjaya)",
                    retry: "Please enter place name, (eg. Pandu Sanjaya)"
                },
            }],
            channel: "guild",
            category: "information"
        });
    }

    public async exec(message: Message, { place }: { place: string; }) {
        try {
            const { data } = await axios.get('https://sholat.kekmareborn.ga/cari/' + encodeURIComponent(place));
            if (!data.result) return message.util!.send('I can\'t find that place!');
            
            const result = data.result[0];
            const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle(place + ' Pray Schedule')
            .addField('Timezone', `${result.location.timezone.name} ${result.location.timezone.offset}`);

            let scheduleText = "";
            for (let i = 0; i < Object.keys(result.schedule).length; i++) {
                const key = Object.keys(result.schedule)[i];
                const val = Object.values(result.schedule)[i];

                scheduleText += `${i+1}. ${key}: ${val}\n`;
            }
            embed.setDescription(scheduleText);

            message.util!.send(embed);
        } catch (e) {
            message.util!.send('Error: ' + e);
        }
    }
}