import { BaseCommandInteraction, Client } from "discord.js";
import { Command } from "../Types/Command";
export const Help: Command = {
  name: "help",
  description: "Help with Filthy slash commands.",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction) => {
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
              name: "/ranks",
              value: "Gamers DOTA ranks.",
            },
            {
              name: "/stevesLatest",
              value: "Steves latest stealth video.",
            },
          ],
          image: {
            url: "https://cdn-japantimes.com/wp-content/uploads/2021/09/np_file_109890-scaled.jpeg",
          },
          timestamp: new Date(),
        },
      ],
    });
  },
};
