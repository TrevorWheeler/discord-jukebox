import { Client, Message } from "discord.js";
import Track from 'Types/Track';
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

      const playlist: SpotifyApi.PlaylistTrackObject[] = spotifyPlaylist.body.items;
      const queue: Track[] = playlist.map((x) => {
        return {
          name: x.track.name,
          album: x.track.album.name,
          artists: x.track.artists
        };
      });
      await JukeBox.addToPlayerQueue(queue);
      JukeBox.enterChannel(message.member.voice.channel);
    } catch (error: any) {
      console.log(error.message);
    }
  },
};
