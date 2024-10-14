import { ApplicationCommandType, Client, Message } from "discord.js";
import JukeBox from "../Plugins/JukeBox";
import Track from "../Types/Track";
import ChannelConfig from "../Types/ChannelConfig";
import { MessageInteraction } from "../Types/MessageInteraction";
import { DiscordGatewayAdapterCreator } from "@discordjs/voice";
import {
  CreateVoiceConnectionOptions,
  JoinVoiceChannelOptions,
} from "@discordjs/voice";
export const Play: MessageInteraction = {
  name: "play",
  description: "Plays song.",
  type: ApplicationCommandType.Message,
  run: async (client: Client, message: Message) => {
    if (!message.guild || !message.member || !message.member.voice.channel) {
      return;
    }
    try {
      const query: string = message.content.trim();
      const queue: Track[] = await JukeBox.getPlayerQueue(query);
      await JukeBox.addToPlayerQueue(queue);
      if (JukeBox.channelInactive) {
        const channelConfig: CreateVoiceConnectionOptions &
          JoinVoiceChannelOptions = {
          guildId: message.member.voice.channel.guild.id,
          channelId: message.member.voice.channel.id,
          adapterCreator: message.member.voice.channel.guild
            .voiceAdapterCreator as DiscordGatewayAdapterCreator,
        };
        JukeBox.enterChannel(channelConfig);
      }
      message.react("👌");
    } catch (error: any) {
      console.log(error.message);
    }
  },
};
