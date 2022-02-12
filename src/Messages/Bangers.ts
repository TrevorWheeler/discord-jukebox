import { createDefaultAudioReceiveStreamOptions } from "@discordjs/voice";
import { Client, Message } from "discord.js";
const {
  NoSubscriberBehavior,
  createAudioPlayer,
  createAudioResource,
  entersState,
  VoiceConnectionStatus,
  joinVoiceChannel,
  generateDependencyReport,
} = require("@discordjs/voice");
const puppeteer = require("puppeteer");
import { getStream } from "puppeteer-stream";

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
      const browser = await puppeteer.launch({
        defaultViewport: {
          width: 1920,
          height: 1080,
        },
      });

      const page = await browser.newPage();
      await page.goto(
        "https://soundcloud.com/thingsbyhudson/sets/rocket-league-playlist",
        {
          waitUntil: "networkidle0",
        }
      );

      await page.setDefaultNavigationTimeout(0);
      const stream = await getStream(page, { audio: true, video: false });

      await page.click(".sc-button-play");
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

      const resource = createAudioResource(stream);
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
