import {
  AudioPlayer,
  CreateAudioPlayerOptions,
  VoiceConnection,
} from "@discordjs/voice";
import { VoiceChannel } from "discord.js";

const {
  entersState,
  VoiceConnectionStatus,
  joinVoiceChannel,
} = require("@discordjs/voice");

let instance: VoiceConnection | null = null;

export default async (channel: any, destroy: boolean) => {
  if (destroy) {
    instance = null;
    return instance;
  }
  if (!instance && channel) {
    instance = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });
    await entersState(instance, VoiceConnectionStatus.Ready, 30_000);
  }
  return instance;
};
