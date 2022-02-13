import { Client, Message, MessageEmbed } from "discord.js";
import { launch, getStream } from "puppeteer-stream";
import { PlayerOptions } from "spotify-playback-sdk/dist/spotify";
import SpotifyWebApi from "spotify-web-api-node";
const {
  NoSubscriberBehavior,
  createAudioPlayer,
  createAudioResource,
  entersState,
  VoiceConnectionStatus,
  joinVoiceChannel,
} = require("@discordjs/voice");

const { getBrowserInstance } = require("../Plugins/puppeteer");
export const Bangers: any = {
  name: "bnc",
  description: "Plays Bangers",
  type: "REPLY",
  run: async (client: Client, message: Message) => {
    if (!message.guild || !message.member || !message.member?.voice.channel) {
      return "nope";
    }
    let connection: any;
    try {
      const browser = await getBrowserInstance();
      const page = await browser.newPage();

      await page.goto("https://open.spotify.com", {
        waitUntil: "networkidle0",
        timeout: 0,
      });

      if (!process.env.SPOTIFY_PAGE_AUTHENTICATED) {
        await page.waitForSelector(".jzic9t5dn38QUOYlDka0");

        await page.click(".jzic9t5dn38QUOYlDka0");

        await page.waitForSelector("#login-username");

        await page.type(
          "#login-username",
          process.env.SPOTIFY_USERNAME ? process.env.SPOTIFY_USERNAME : ""
        );
        await page.type(
          "#login-password",
          process.env.SPOTIFY_PASSWORD ? process.env.SPOTIFY_PASSWORD : ""
        );

        await page.click("#login-button");

        await page.waitForNavigation({
          waitUntil: "networkidle0",
        });

        process.env.SPOTIFY_PAGE_AUTHENTICATED = "true";
      } else {
        await page.waitForTimeout(4000);
      }

      const Spotify = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      });

      Spotify.setAccessToken(
        process.env.SPOTIFY_TOKEN ? process.env.SPOTIFY_TOKEN : ""
      );
      Spotify.setRefreshToken(
        process.env.SPOTIFY_REFRESH_TOKEN
          ? process.env.SPOTIFY_REFRESH_TOKEN
          : ""
      );
      const devices = await Spotify.getMyDevices();
      let deviceId: string | null = devices.body.devices[0].id;
      const bangersAndClangers = await Spotify.getPlaylist(
        "6Lbd3XVZtsatcq3vuK9PkV"
      );

      Spotify.play({
        device_id: deviceId ? deviceId : "",
        context_uri: bangersAndClangers.body.uri,
      });

      const stream = await getStream(page, {
        audio: true,
        video: false,
        bitsPerSecond: 320000,
        frameSize: 20,
      });

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

      const reply = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle(bangersAndClangers.body.name)
        .setImage(bangersAndClangers.body.images[0].url);
      await message.reply({ embeds: [reply] });

      Spotify.setShuffle(true);
    } catch (error: any) {
      if (connection) {
        connection.destroy();
      }
      console.log(error.message);
    }
  },
};
