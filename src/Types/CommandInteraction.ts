import {
  BaseCommandInteraction,
  ChatInputApplicationCommandData,
  Client,
  Message,
} from "discord.js";

export interface CommandInteraction extends ChatInputApplicationCommandData {
  run: (client: Client, interaction: BaseCommandInteraction | Message) => void;
}