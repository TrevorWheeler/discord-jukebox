import { BaseCommandInteraction, Client } from "discord.js";
import { Command } from "../Types/Command";
import fetch from "node-fetch";

import * as cheerio from "cheerio";
export const StevesLatest: Command = {
  name: "steveslatest",
  description: "Steves latest stealth video.",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    let content = ":(";
    let videoId = null;
    const channelName = "thestevewallis";
    const userDetailsEndPoint =
      "https://www.googleapis.com/youtube/v3/channels?key=" +
      process.env.GOOGLE_API_KEY +
      "&forUsername=" +
      channelName +
      "&part=id";

    const channelDetailsResponse = await fetch(userDetailsEndPoint);

    const channelDetails = await channelDetailsResponse.json();

    const channelId = channelDetails.items[0].id;

    if (channelId) {
      const listEndpoint =
        "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=" +
        channelId +
        "&maxResults=10&order=date&type=video&key=" +
        process.env.GOOGLE_API_KEY;
      const response = await fetch(listEndpoint);

      const body = await response.json();

      videoId =
        body && body.items && body.items.length > 0
          ? body.items[0].id.videoId
          : null;
    }

    if (videoId) {
      content = "https://www.youtube.com/watch?v=" + videoId;
    }

    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
