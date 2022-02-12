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
} = require("@discordjs/voice");

export const Hello: any = {
  name: "hello",
  description: "Returns a response from Filthy himself.",
  type: "REPLY",
  run: async (client: Client, message: Message) => {
    if (!message.guild) return;

    const channel = message.member?.voice.channel;
    if (channel) {
      try {
        const connection = await connectToChannel(
          message.member?.voice.channel
        );

        connection.playStream("http://stream01.iloveradio.de/iloveradio9.mp3");

        await message.reply("Hello!");
      } catch (error) {
        console.error(error);
      }
    } else {
      await message.reply("Join a voice channel then try again!");
    }

    return ":)";
  },
};

async function connectToChannel(channel: any) {
  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
  });
  try {
    await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
    return connection;
  } catch (error) {
    connection.destroy();
    throw error;
  }
}
