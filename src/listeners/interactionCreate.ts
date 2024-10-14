import {
  CommandInteraction,
  Client,
  Interaction,
  ContextMenuCommandInteraction,
  ChatInputCommandInteraction,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
  SelectMenuInteraction,
} from "discord.js";
import { Command } from "../Types/CommandInteraction";
import { Commands } from "../handlers/Commands";
import { Selects } from "../handlers/Selects";

export default (client: Client): void => {
  client.on("interactionCreate", async (interaction: Interaction) => {
    if (isCommandOrContextMenu(interaction)) {
      await handleSlashCommand(client, interaction);
    }
    if (interaction.isSelectMenu()) {
      await interaction.deferUpdate();
      await handleSelectCommand(client, interaction);
    }
  });
};

// Type guard function
function isCommandOrContextMenu(
  interaction: Interaction
): interaction is
  | ChatInputCommandInteraction
  | MessageContextMenuCommandInteraction
  | UserContextMenuCommandInteraction {
  return (
    interaction.isChatInputCommand() ||
    interaction.isMessageContextMenuCommand() ||
    interaction.isUserContextMenuCommand()
  );
}

const handleSlashCommand = async (
  client: Client,
  interaction: CommandInteraction | ContextMenuCommandInteraction
): Promise<void> => {
  const slashCommand: Command | undefined = Commands.find(
    (commandInteraction: Command) =>
      commandInteraction.name === interaction.commandName
  );
  if (!slashCommand) {
    interaction.followUp({ content: "Sorry, not doing that." });
    return;
  }
  await interaction.deferReply();
  slashCommand.run(client, interaction);
};

const handleSelectCommand = async (
  client: Client,
  interaction: SelectMenuInteraction
): Promise<void> => {
  const selectOption: any | undefined = Selects.find(
    (selectInteraction: any) => selectInteraction.name === interaction.customId
  );

  if (!selectOption) {
    return;
  }

  selectOption.run(client, interaction);
};
