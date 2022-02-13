import { createDefaultAudioReceiveStreamOptions } from "@discordjs/voice";
import {
  BaseCommandInteraction,
  Client,
  Interaction,
  Message,
} from "discord.js";
import { Browser, Page } from "puppeteer";
const { getBrowserInstance } = require("../Plugins/puppeteer");
const { getVoiceConnection } = require("@discordjs/voice");

export const Stop: any = {
  name: "stop",
  description: "Returns a response from Filthy himself.",
  type: "REPLY",
  run: async (client: Client, message: Message) => {
    if (!message.guild || !message.member || !message.member?.voice.channel) {
      return "Something went wrong. Mute me instead";
    }
    const browser: Browser = await getBrowserInstance();
    const pages = await browser.pages();
    for (const page of pages) {
      const isSpotify = await page.evaluate(() => {
        return document.URL == "https://open.spotify.com/";
      });
      if (isSpotify) {
        await page.close();
      }
    }
    const connection = getVoiceConnection(message.guild.id);
    if (!connection) {
      return;
    }
    connection.destroy();

    return;
  },
};
