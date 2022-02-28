import { BaseCommandInteraction, Client, Message } from "discord.js";
import { CommandInteraction } from "../Types/CommandInteraction";
export const Help: CommandInteraction = {
  name: "help",
  description: "Help for Filthy Bot",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction | Message) => {
    interaction = interaction as BaseCommandInteraction;
    await interaction.followUp({
      embeds: [
        {
          color: 0x0099ff,
          title: "Slash Commands",
          author: {
            name: "Filthy",
          },
          fields: [
            {
              name: "/roll",
              value: "Random roll between 0 - 100",
            },
            {
              name: "/joke",
              value: "The Filthiest joke you ever heard.",
            },
            {
              name: "/stevesLatest",
              value: "Posts Steves latest stealth video.",
            },
            {
              name: "-f radio",
              value: "Joins channel and plays Triple J",
            },
            {
              name: "-f p ${query}",
              value: "Attempts to play the searched query. If player is active the queried result will be added to player queue.",
            },
            {
              name: "-f stop",
              value: "Deletes queue and Leaves channel.",
            },
          ],
        },
      ],
    });
  },
};
