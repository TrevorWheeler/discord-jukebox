
import { BaseCommandInteraction, Client, Message } from "discord.js";
import { CommandInteraction } from "../Types/CommandInteraction";

export const Roll: CommandInteraction = {
  name: "roll",
  description: "Random roll between 0 - 100",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction | Message) => {
    interaction = interaction as BaseCommandInteraction;
    const content: string = Math.floor(
      Math.random() * (100 - 0 + 1) + 0
    ).toString();
    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
