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
  voice,
  getVoiceConnection,
  generateDependencyReport,
} = require("@discordjs/voice");

export const Stop: any = {
  name: "stop",
  description: "Returns a response from Filthy himself.",
  type: "REPLY",
  run: async (client: Client, message: Message) => {
    if (!message.guild || !message.member || !message.member?.voice.channel) {
      return "Something went wrong. Mute me instead";
    }
    const connection = getVoiceConnection(message.guild.id);
    if (!connection) {
      return "I'm not in a voice channel!";
    }
    connection.destroy();
    return "Thanks for having me :)";
  },
};
