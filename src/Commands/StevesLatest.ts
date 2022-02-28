import { BaseCommandInteraction, Client, Message } from "discord.js";
import { CommandInteraction } from "../Types/CommandInteraction";
import fetch from "node-fetch";
export const StevesLatest: CommandInteraction = {
  name: "steveslatest",
  description: "Steves latest stealth video.",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction | Message) => {
    interaction = interaction as BaseCommandInteraction;
    let content: string = ":(";
    let videoId: string | null = null;
    // Request stevens youtube channel Id
    const fetchSteve = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?key=" +
      process.env.GOOGLE_API_KEY +
      "&forUsername=thestevewallis&part=id"
    );
    const channel = await fetchSteve.json();
    const channelId: string =
      channel && channel.items.length > 0 && channel.items[0].id
        ? channel.items[0].id
        : null;
    // use stevens channel id to get his latest video
    if (channelId) {
      const latestVideosResponse = await fetch(
        "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=" +
        channelId +
        "&maxResults=10&order=date&type=video&key=" +
        process.env.GOOGLE_API_KEY
      );
      const latestVideos = await latestVideosResponse.json();
      videoId =
        latestVideos && latestVideos.items && latestVideos.items.length > 0
          ? latestVideos.items[0].id.videoId
          : null;

      if (videoId) {
        content = "https://www.youtube.com/watch?v=" + videoId;
      }
    }
    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
