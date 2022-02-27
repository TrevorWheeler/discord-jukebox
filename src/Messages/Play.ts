import { Client, Message } from "discord.js";
import fetch from "node-fetch";
import Spotify from "../Plugins/Spotify";
import JukeBox from "../Plugins/JukeBox";
import Track from 'Types/Track';
import ChannelConfig from '../Types/ChannelConfig';
export const Play: any = {
  name: "play",
  description: "Plays song.",
  type: "REPLY",
  run: async (client: Client, message: Message) => {
    if (!message.guild || !message.member || !message.member.voice.channel) {
      return;
    }
    try {
      const query: string = message.content.trim();
      let queue: Track[] = [];
      let youtubeLinkId: string | false = youtubeParser(query);
      const isSpotifyLink: string[] | false = spotifyParser(query);
      if (!youtubeLinkId && !isSpotifyLink) {
        const search = await fetch(
          "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=" +
          query +
          "&type=video&key=" +
          process.env.GOOGLE_API_KEY
        );
        const result: any = await search.json();
        youtubeLinkId = result.items[0].id.videoId;
      } else if (isSpotifyLink) {
        const [spotifyRequestType, id]: string[] = isSpotifyLink;

        const spotify = await Spotify();
        switch (spotifyRequestType) {
          case "playlist":
            const playlist = await spotify.getPlaylistTracks(
              id
            );
            const playlistTracks: SpotifyApi.PlaylistTrackObject[] = playlist.body.items;
            queue = playlistTracks.map((x: SpotifyApi.PlaylistTrackObject) => {
              return {
                name: x.track.name,
                album: x.track.album.name,
                artists: x.track.artists
              };
            });
            break;
          case "track":
            const track = await spotify.getTrack(
              id
            );
            queue = [{
              name: track.body.name,
              album: track.body.album.name,
              artists: track.body.artists
            }];
            break;
          case "album":
            const album = await spotify.getAlbum(
              id
            );

            const albumTracks: SpotifyApi.TrackObjectSimplified[] = album.body.tracks.items;
            queue = albumTracks.map((x: SpotifyApi.TrackObjectSimplified) => {
              return {
                name: x.name,
                album: album.body.name,
                artists: x.artists
              };
            });
            break;
        }
      }
      await JukeBox.addToPlayerQueue(queue, youtubeLinkId);

      if (JukeBox.channelInactive) {
        const channelConfig: ChannelConfig = {
          guildId: message.member.voice.channel.guild.id,
          channelId: message.member.voice.channel.id,
          adapterCreator: message.member.voice.channel.guild.voiceAdapterCreator
        };
        JukeBox.enterChannel(channelConfig);
      }
      message.react("👌");
    } catch (error: any) {
      console.log(error.message);
    }
  },
};

function youtubeParser(url: string): string | false {
  const match = url.match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/);
  return match && match[7].length === 11 ? match[7] : false;
}

function spotifyParser(str: string): string[] | false {
  const match = str.match(/^(?:spotify:|(?:https?:\/\/(?:open|play)\.spotify\.com\/))(?:embed)?\/?(album|track|playlist)(?::|\/)((?:[0-9a-zA-Z]){22})/);
  return match ? [match[1], match[2]] : false;
}



