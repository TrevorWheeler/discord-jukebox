import { Client, Message, MessageActionRow, MessageSelectMenu, MessageSelectMenuOptions, MessageSelectOptionData } from "discord.js";
import fetch from "node-fetch";
import Track from '../Types/Track';
import JukeBox from '../Plugins/JukeBox';
import { MessageInteraction } from '../Types/MessageInteraction';
export const Show: MessageInteraction = {
    name: "show",
    description: "Shows matches against requested query.",
    type: "MESSAGE",
    run: async (client: Client, message: Message) => {
        if (!message.guild || !message.member || !message.member.voice.channel) {
            return;
        }
        try {
            const query: string = message.content.trim();
            const queue: Track[] = await JukeBox.getPlayerQueue(query, true);

            let selectOptions: MessageSelectOptionData[] = queue.map((x: any) => {
                return {
                    label: x.youtubeTitle.substring(0, 100),
                    description: "Add to queue.",
                    value: x.name
                };
            });
            if (selectOptions.length > 25) {
                selectOptions = selectOptions.slice(0, 25);
            }
            const row: MessageActionRow = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('song')
                        .setPlaceholder('Awaiting your selection...')
                        .addOptions(selectOptions),
                );
            await message.reply({ content: 'Select a song.', components: [row] });

        } catch (error: any) {
            console.log(error.message);
        }
    },
};
