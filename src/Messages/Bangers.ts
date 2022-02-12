import { createDefaultAudioReceiveStreamOptions } from "@discordjs/voice";
import {
  BaseCommandInteraction,
  Client,
  Interaction,
  Message,
} from "discord.js";
const Mic = require("mic");
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
      const channel = message.member?.voice.channel;
      connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      });
      await entersState(connection, VoiceConnectionStatus.Ready, 30_000);

      const micInstance: any = Mic({
        rate: "16000",
        channels: "1",
        debug: true,
        exitOnSilence: 6,
      });
      const micInputStream = micInstance.getAudioStream();

      const outputFileStream = fs.createWriteStream("/tmp/output.raw");
      micInputStream.pipe(outputFileStream);

      // micInputStream.on("data", function (data: any) {
      //   console.log("Recieved Input Stream: " + data.length);
      // });

      // micInputStream.on("error", function (err: any) {
      //   console.log("Error in Input Stream: " + err);
      // });

      // micInputStream.on("startComplete", function () {
      //   console.log("Got SIGNAL startComplete");
      //   setTimeout(function () {
      //     micInstance.pause();
      //   }, 5000);
      // });

      // micInputStream.on("stopComplete", function () {
      //   console.log("Got SIGNAL stopComplete");
      // });

      // micInputStream.on("pauseComplete", function () {
      //   console.log("Got SIGNAL pauseComplete");
      //   setTimeout(function () {
      //     micInstance.resume();
      //   }, 5000);
      // });

      // micInputStream.on("resumeComplete", function () {
      //   console.log("Got SIGNAL resumeComplete");
      //   setTimeout(function () {
      //     micInstance.stop();
      //   }, 5000);
      // });

      // micInputStream.on("silence", function () {
      //   console.log("Got SIGNAL silence");
      // });

      // micInputStream.on("processExitComplete", function () {
      //   console.log("Got SIGNAL processExitComplete");
      // });

      micInstance.start();
      const player = createAudioPlayer({
        behaviors: {
          noSubscriber: NoSubscriberBehavior.Pause,
        },
      });

      const resource = createAudioResource(micInputStream);
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
