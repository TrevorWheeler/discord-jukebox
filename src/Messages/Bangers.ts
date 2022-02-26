import { Client, Message, MessageEmbed } from "discord.js";
import JukeBox from '../Plugins/JukeBox';
import Spotify from "../Plugins/Spotify";

export const Bangers: any = {
  name: "bnc",
  description: "Plays Bangers",
  type: "REPLY",
  run: async (client: Client, message: Message) => {
    if (!message.guild || !message.member || !message.member?.voice.channel) {
      return "nope";
    }
    try {
      const spotify = await Spotify();
      const spotifyPlaylist = await spotify.getPlaylistTracks(
        "6Lbd3XVZtsatcq3vuK9PkV"
      );
      const playList = spotifyPlaylist.body.items;
      await JukeBox.addToPlayerQueue(playList);
      JukeBox.enterChannel(message.member.voice.channel);
    } catch (error: any) {
      console.log(error.message);
    }
  },
};
