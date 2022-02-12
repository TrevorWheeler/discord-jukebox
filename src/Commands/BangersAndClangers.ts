import {
  BaseCommandInteraction,
  Client,
  GuildMember,
  VoiceChannel,
} from "discord.js";

import { Command } from "../Types/Command";

export const BangersAndClangers: Command = {
  name: "bangers",
  description: "Joins channel and plays bangers",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    console.log(interaction);

    const content = "Sorry :(";
    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
