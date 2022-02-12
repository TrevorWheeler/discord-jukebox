import { createDefaultAudioReceiveStreamOptions } from "@discordjs/voice";
import { Client, Message } from "discord.js";
import fs from "fs";
const {
  NoSubscriberBehavior,
  createAudioPlayer,
  createAudioResource,
  entersState,
  VoiceConnectionStatus,
  joinVoiceChannel,
  generateDependencyReport,
} = require("@discordjs/voice");

const AudioContext = require("web-audio-api");
export const Bangers: any = {
  name: "bnc",
  description: "Plays Bangers",
  type: "REPLY",
  run: async (client: Client, message: Message) => {
    if (!message.guild || !message.member || !message.member?.voice.channel) {
      return "nope";
    }
    console.log(generateDependencyReport());
    let connection: any;
    try {
      // const channel = message.member?.voice.channel;
      // connection = joinVoiceChannel({
      //   channelId: channel.id,
      //   guildId: channel.guild.id,
      //   adapterCreator: channel.guild.voiceAdapterCreator,
      // });
      // await entersState(connection, VoiceConnectionStatus.Ready, 30_000);

      // const player = createAudioPlayer({
      //   behaviors: {
      //     noSubscriber: NoSubscriberBehavior.Pause,
      //   },
      // });
      // const context = new AudioContext();

      // context.outStream = process.stdout;
      // const resource = createAudioResource(context.outStream);
      // player.play(resource);

      // connection.subscribe(player);
      return ":)";
    } catch (error: any) {
      if (connection) {
        connection.destroy();
      }

      return error.message;
    }
  },
};
