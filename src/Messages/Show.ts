import { Client, Message, MessageActionRow, MessageSelectMenu, MessageSelectMenuOptions, MessageSelectOptionData } from "discord.js";
import fetch from "node-fetch";
import Spotify from "../Plugins/Spotify";
import JukeBox from "../Plugins/JukeBox";
import Track from 'Types/Track';
export const Show: any = {
    name: "show",
    description: "Shows 5 matches against requested query.",
    type: "REPLY",
    run: async (client: Client, message: Message) => {
        if (!message.guild || !message.member || !message.member.voice.channel) {
            return;
        }
        try {
            const query: string = message.content.trim();
            const search = await fetch(
                "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=" +
                query +
                "&type=video&key=" +
                process.env.GOOGLE_API_KEY
            );
            const result: any = await search.json();



            const selectOptions: MessageSelectOptionData[] = result.items.map((x: any) => {
                return {
                    label: x.snippet.title,
                    description: "Add to queue.",
                    value: x.id.videoId
                };
            });






            const row = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('select')
                        .setPlaceholder('Please select a song.')
                        .addOptions(selectOptions),
                );

            await message.reply({ content: 'Please select a song', components: [row] });

        } catch (error: any) {
            console.log(error.message);
        }
    },
};


