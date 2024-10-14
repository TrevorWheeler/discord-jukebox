import {
  Client,
  GuildMember,
  SelectMenuInteraction,
  VoiceBasedChannel,
} from "discord.js";
import ChannelConfig from "../Types/ChannelConfig";

import JukeBox from "../Plugins/JukeBox";
import Track from "../Types/Track";
import {
  CreateVoiceConnectionOptions,
  DiscordGatewayAdapterCreator,
  JoinVoiceChannelOptions,
} from "@discordjs/voice";
export const Song: any = {
  name: "song",
  description: "Adds the selected song to the player queue.",
  type: "SELECT",
  run: async (client: Client, interaction: SelectMenuInteraction) => {
    if (
      !interaction ||
      !interaction.guild ||
      !interaction.member ||
      !(interaction.member as GuildMember).voice ||
      !(interaction.member as GuildMember).voice.channel ||
      !((interaction.member as GuildMember).voice.channel as VoiceBasedChannel)
        .id
    ) {
      return;
    }

    const queue: Track[] = await JukeBox.getPlayerQueue(interaction.values[0]);

    await JukeBox.addToPlayerQueue(queue);

    if (JukeBox.channelInactive) {
      const channelConfig: CreateVoiceConnectionOptions &
        JoinVoiceChannelOptions = {
        guildId: interaction.guild.id,
        channelId: (
          (interaction.member as GuildMember).voice.channel as VoiceBasedChannel
        ).id,
        adapterCreator: interaction.guild
          .voiceAdapterCreator as DiscordGatewayAdapterCreator,
      };

      JukeBox.enterChannel(channelConfig);
    }
  },
};
