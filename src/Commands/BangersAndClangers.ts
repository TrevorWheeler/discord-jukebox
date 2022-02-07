import { BaseCommandInteraction, Client } from "discord.js";
import { Command } from "../Types/Command";
import Spotify from "../Utilities/Spotify";
export const BangersAndClangers: Command = {
  name: "bangers",
  description: "Joins channel and plays bangers",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    // const spotify = await Spotify();

    const content = "Sorry :(";

    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
