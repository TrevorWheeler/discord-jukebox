import { AudioPlayer, VoiceConnection } from "@discordjs/voice";
import { Client, Message, MessageEmbed } from "discord.js";
import generateQueue from "../handlers/generateQueue";
import playQueue from "../handlers/playQueue";
import Channel from "../Plugins/channel";
import Player from "../Plugins/player";
import Spotify from "../Plugins/Spotify";

export const Bangers: any = {
  name: "bnc",
  description: "Plays Bangers",
  type: "REPLY",
  run: async (client: Client, message: Message) => {
    if (!message.guild || !message.member || !message.member?.voice.channel) {
      return "nope";
    }
    let channel: VoiceConnection | null = null;
    try {
      const spotify = await Spotify();
      const spotifyPlaylist= await spotify.getPlaylistTracks(
        "6Lbd3XVZtsatcq3vuK9PkV"
      );

      const playList = spotifyPlaylist.body.items;
      await generateQueue(playList, false);
      await playQueue();

      channel = await Channel(message.member.voice.channel, false);
      const player: AudioPlayer | null = Player();
      if (!player || !channel) {
        throw new Error("Channel or audio player not initialised.");
      }

      channel.subscribe(player);
    } catch (error: any) {
      if (channel) {
        channel.destroy();
      }
      console.log(error.message);
    }
  },
};
