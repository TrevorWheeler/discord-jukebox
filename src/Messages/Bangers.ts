import { createDefaultAudioReceiveStreamOptions } from "@discordjs/voice";
import {
  BaseCommandInteraction,
  Client,
  Interaction,
  Message,
} from "discord.js";

const {
  NoSubscriberBehavior,
  StreamType,
  createAudioPlayer,
  createAudioResource,
  entersState,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  joinVoiceChannel,
  generateDependencyReport,
} = require("@discordjs/voice");

export const Bangers: any = {
  name: "bnc",
  description: "Returns a response from Filthy himself.",
  type: "REPLY",
  run: async (client: Client, message: Message) => {
    if (!message.guild || !message.member || !message.member?.voice.channel) {
      return "nope";
    }
    console.log(generateDependencyReport());
    let connection: any;
    try {
      const channel = message.member?.voice.channel;
      connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      });
      await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
      const player = createAudioPlayer({
        behaviors: {
          noSubscriber: NoSubscriberBehavior.Pause,
        },
      });

      const resource = createAudioResource(
        "http://stream01.iloveradio.de/iloveradio9.mp3"
      );
      player.play(resource);

      connection.subscribe(player);
      return ":)";
    } catch (error: any) {
      if (connection) {
        connection.destroy();
      }

      return error.message;
    }
  },
};
