import axios from "axios";
import type Upin from "./Upin";
import prettyMilliseconds from "pretty-ms";

export default class Util {
    constructor(private client: Upin) {}
    public async hastebin(text: string) {
        if (!text.length) throw Error('Invalid text');
        const { data }: { data: { key: string; }} = await axios.post('https://bin.hansputera.me/documents', {
            "data": text
        });
        return "https://bin.hansputera.me/" + data.key;
    }

    public parseDur(ms: number) {
        return prettyMilliseconds(ms, {
            colonNotation: true,
            secondsDecimalDigits: 0
        });
    }

    public chunk(arr: any[], size: number) {
        const temp = [];
        for (var i=0; i < arr.length; i += size) {
            temp.push(arr.slice(i, i+size));
        }
        return temp;
    }

    public toTitleCase(str: string) {
        return str.replace(
          /\w\S*/g,
          function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          }
        );
      }

        public getRandomIndex() {
            return Math.floor(Math.random() * this.client.configuration.lavalink.nodes.length);
        }

        public getRandomNode() {
            const node = this.client.configuration.lavalink.nodes[this.getRandomIndex()];
            const nodeManager = this.client.musicManager.manager.nodes.get(node.id);

            if (nodeManager!.connected) this.client.nodeLavalink = node.id;
            else this.client.nodeLavalink = "aqua-lavalink";
            return { node, nodeManager };
        }
}