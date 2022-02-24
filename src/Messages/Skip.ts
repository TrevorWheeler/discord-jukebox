import { Client, Message } from "discord.js";
import { Browser, Page } from "puppeteer";
import SpotifyWebApi from "spotify-web-api-node";

export const Skip: any = {
  name: "skip",
  description: "Skip Track",
  type: "REPLY",
  run: async (client: Client, message: Message) => {
    const Spotify = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });

    Spotify.setAccessToken(
      process.env.SPOTIFY_TOKEN ? process.env.SPOTIFY_TOKEN : ""
    );
    Spotify.setRefreshToken(
      process.env.SPOTIFY_REFRESH_TOKEN ? process.env.SPOTIFY_REFRESH_TOKEN : ""
    );

    Spotify.skipToNext();
  },
};
