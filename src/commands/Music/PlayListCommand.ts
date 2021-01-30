import { Command } from "discord-akairo";
import { Message } from "discord.js";
import type Upin from "../../structures/Upin";

export default class PlayListCommand extends Command {
    constructor(public client: Upin) {
        super('playlist', {
            aliases: ['pl', 'playlist'],
            editable: false,
            ratelimit: 5,
            args: [
                {
                    id: "create",
                    match: "flag",
                    flag: ["--create", "-c", "--add", "-d"]
                }, {
                    id: "delete",
                    match: "flag",
                    flag: ['--delete', '-d', '--remove', '-r']
                }, {
                    id: "playlistName",
                    match: "rest"
                }
            ]
        });
    }

    public async exec(message: Message, args: any) {
        if (!args.create && !args.delete) return message.util!.reply('Please use flag, --delete and --add');
        if (args.create && args.delete) return message.util!.reply('Please only use one flag, --delete and --add');
        if (args.create) {
            const { playlistName }: { playlistName: string; } = args;
            if (!playlistName) return message.util!.reply('Please enter playlist name!');
            const playlistCreated = await this.client.playlist.create(message.author.id, playlistName);
            if (!playlistCreated) return message.util!.reply('Playlist is available in your playlists!');
            else message.util!.send(`Your playlist **${(await this.client.playlist.getPlaylist(playlistName, message.author.id))!.data.name}** has been created!`);
        } else if (args.delete) {
            const { playlistName }: { playlistName: string; } = args;
            if (!playlistName) return message.util!.reply('Please enter playlist name!');
            const playlistDeleted = await this.client.playlist.deletePlaylist(message.author.id, playlistName);
            if (!playlistDeleted) return message.util!.reply('Playlist not found!');
            else message.util!.reply('Playlist was deleted!');
        }
    }
}