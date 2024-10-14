import {
  CommandInteraction,
  Client,
  Message,
  ApplicationCommandType,
} from "discord.js";
import { Command } from "../Types/CommandInteraction";

export const Roll: Command = {
  name: "roll",
  description: "Random roll between 0 - 100",
  type: ApplicationCommandType.ChatInput,
  run: async (client: Client, interaction: CommandInteraction | Message) => {
    interaction = interaction as CommandInteraction;
    const content: string = Math.floor(
      Math.random() * (100 - 0 + 1) + 0
    ).toString();
    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
