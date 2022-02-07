import { BaseCommandInteraction, Client } from "discord.js";
import SpotifyWebApi from "spotify-web-api-node";
import { Command } from "../Types/Command";
import Spotify from "../Utilities/Spotify";
export const Roll: Command = {
  name: "roll",
  description: "Random roll between 0 - 100",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const content: string = Math.floor(
      Math.random() * (100 - 0 + 1) + 0
    ).toString();

    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
