"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class PlayListCommand extends discord_akairo_1.Command {
    constructor(client) {
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
        this.client = client;
    }
    async exec(message, args) {
        if (!args.create && !args.delete)
            return message.util.reply('Please use flag, --delete and --add');
        if (args.create && args.delete)
            return message.util.reply('Please only use one flag, --delete and --add');
        if (args.create) {
            const { playlistName } = args;
            if (!playlistName)
                return message.util.reply('Please enter playlist name!');
            const playlistCreated = await this.client.playlist.create(message.author.id, playlistName);
            if (!playlistCreated)
                return message.util.reply('Playlist is available in your playlists!');
            else
                message.util.send(`Your playlist **${(await this.client.playlist.getPlaylist(playlistName, message.author.id)).data.name}** has been created!`);
        }
        else if (args.delete) {
            const { playlistName } = args;
            if (!playlistName)
                return message.util.reply('Please enter playlist name!');
            const playlistDeleted = await this.client.playlist.deletePlaylist(message.author.id, playlistName);
            if (!playlistDeleted)
                return message.util.reply('Playlist not found!');
            else
                message.util.reply('Playlist was deleted!');
        }
    }
}
exports.default = PlayListCommand;
