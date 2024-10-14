import {
  ApplicationCommandType,
  Client,
  Message,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ButtonBuilder,
} from "discord.js";
import Track from "../Types/Track";
import JukeBox from "../Plugins/JukeBox";
import { MessageInteraction } from "../Types/MessageInteraction";

export const Show: MessageInteraction = {
  name: "show",
  description: "Shows matches against requested query.",
  type: ApplicationCommandType.Message,
  run: async (client: Client, message: Message) => {
    if (!message.guild || !message.member || !message.member.voice.channel) {
      await message.reply(
        "You need to be in a voice channel to use this command."
      );
      return;
    }

    try {
      const query: string = message.content
        .split(" ")
        .slice(1)
        .join(" ")
        .trim();
      if (!query) {
        await message.reply("Please provide a search query.");
        return;
      }

      const queue: Track[] = await JukeBox.getPlayerQueue(query, true);

      if (queue.length === 0) {
        await message.reply("No songs found matching your query.");
        return;
      }
      const selectOptions: StringSelectMenuOptionBuilder[] = queue
        .slice(0, 25)
        .map(
          (track: Track) =>
            new StringSelectMenuOptionBuilder({
              description: "Add to queue",
              label: (track.youtubeTitle ?? track.name).substring(0, 100),
              value: track.name,
              emoji: "🎶",
            })
        );

      const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("song")
          .setPlaceholder("Select a song to add to the queue")
          .addOptions(selectOptions)
      );

      await message.reply({
        content: "Select a song to add to the queue:",
        components: [row],
      });
    } catch (error: any) {
      console.error("Error in Show command:", error);
      await message.reply(
        "An error occurred while processing your request. Please try again later."
      );
    }
  },
};
