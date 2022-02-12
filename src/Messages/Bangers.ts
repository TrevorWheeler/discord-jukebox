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
import { launch, getStream } from "puppeteer-stream";

export const Bangers: any = {
  name: "bnc",
  description: "Plays Bangers",
  type: "REPLY",
  run: async (client: Client, message: Message, chrome: any) => {
    if (!message.guild || !message.member || !message.member?.voice.channel) {
      return "nope";
    }
    console.log(generateDependencyReport());
    let connection: any;
    try {
      const browser = await launch({
        headless: false,
        executablePath:
          "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
        defaultViewport: {
          width: 1920,
          height: 1080,
        },
      });

      const page = await browser.newPage();

      await page
        .goto("https://open.spotify.com", {
          waitUntil: "networkidle2",
          timeout: 0,
        })
        .then(() => console.log("page is open"));
      // const browser = await launch({
      //   headless: false,
      //   defaultViewport: {
      //     width: 1920,
      //     height: 1080,
      //   },
      // });

      // const page = await browser.newPage();

      // await page
      //   .goto(
      //     "https://soundcloud.com/thingsbyhudson/sets/rocket-league-playlist",
      //     {
      //       waitUntil: "networkidle2",
      //       timeout: 0,
      //     }
      //   )
      //   .then(() => console.log("page is open"));

      // await page
      //   .waitForSelector("#onetrust-accept-btn-handler")
      //   .then(() => console.log("Cookie button found"));

      // await page.click("#onetrust-accept-btn-handler");
      // await page.waitForTimeout(2000);
      // await page
      //   .waitForSelector(".playControls__play")
      //   .then(() => console.log("play button found"));
      // await page
      //   .click(".playControls__play")
      //   .then(() => console.log("play button clicked"));
      // const stream = await getStream(page, { audio: true, video: false });

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

      // const resource = createAudioResource(stream);
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
