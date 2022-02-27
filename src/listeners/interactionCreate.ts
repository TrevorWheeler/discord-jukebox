import { entersState, joinVoiceChannel, VoiceConnectionStatus } from '@discordjs/voice';
import { BaseCommandInteraction, Client, GuildMember, Interaction, SelectMenuInteraction, VoiceBasedChannel } from "discord.js";
import ChannelConfig from '../Types/ChannelConfig';

import { Commands } from "../Commands";
import JukeBox from '../Plugins/JukeBox';
export default (client: Client): void => {
  client.on("interactionCreate", async (interaction: Interaction) => {
    if (interaction.isCommand() || interaction.isContextMenu()) {
      await handleSlashCommand(client, interaction);
    }
    if (interaction.isSelectMenu()) {
      await handleMenuCommand(client, interaction);
    }
  });
};

const handleSlashCommand = async (
  client: Client,
  interaction: BaseCommandInteraction
): Promise<void> => {
  const slashCommand = Commands.find((c) => c.name === interaction.commandName);
  if (!slashCommand) {
    interaction.followUp({ content: "An error has occurred" });
    return;
  }

  await interaction.deferReply();

  slashCommand.run(client, interaction);
};

const handleMenuCommand = async (
  client: Client,
  interaction: SelectMenuInteraction
): Promise<void> => {
  if (!interaction || !interaction.guild || !interaction.member || !(interaction.member as GuildMember).voice || !(interaction.member as GuildMember).voice.channel || !((interaction.member as GuildMember).voice.channel as VoiceBasedChannel).id) {
    return;
  }
  const value = interaction.values[0];
  const channelConfig: ChannelConfig = {
    guildId: interaction.guild.id,
    channelId: ((interaction.member as GuildMember).voice.channel as VoiceBasedChannel).id,
    adapterCreator: interaction.guild?.voiceAdapterCreator!
  };
  await JukeBox.addToPlayerQueue([], value);
  if (JukeBox.channelInactive) {
    JukeBox.enterChannel(channelConfig);
  }
};
