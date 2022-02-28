import { BaseCommandInteraction, Client, GuildMember, Interaction, SelectMenuInteraction, VoiceBasedChannel } from "discord.js";
import { CommandInteraction } from "../Types/CommandInteraction";
import ChannelConfig from '../Types/ChannelConfig';

import { Commands } from "../handlers/Commands";
import JukeBox from '../Plugins/JukeBox';
import Track from '../Types/Track';
import { Selects } from '../handlers/Selects';
export default (client: Client): void => {
  client.on("interactionCreate", async (interaction: Interaction) => {
    if (interaction.isCommand() || interaction.isContextMenu()) {
      await handleSlashCommand(client, interaction);
    }
    if (interaction.isSelectMenu()) {
      await interaction.deferUpdate();
      await handleSelectCommand(client, interaction);
    }
  });
};

const handleSlashCommand = async (
  client: Client,
  interaction: BaseCommandInteraction
): Promise<void> => {
  const slashCommand: CommandInteraction | undefined = Commands.find((commandInteraction: CommandInteraction) => commandInteraction.name === interaction.commandName);
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

  const selectOption: any | undefined = Selects.find((selectInteraction: any) => selectInteraction.name === interaction.customId);

  if (!selectOption) {
    return;
  }

  selectOption.run(client, interaction);

};
