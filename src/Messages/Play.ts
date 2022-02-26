import { Client, Message } from "discord.js";
import fetch from "node-fetch";
import Spotify from "../Plugins/Spotify";
import JukeBox from "../Plugins/JukeBox";
export const Play: any = {
  name: "play",
  description: "Plays song.",
  type: "REPLY",
  run: async (client: Client, message: Message) => {
    if (!message.guild || !message.member || !message.member.voice.channel) {
      return;
    }
    try {
      let playList: any[] = [];
      let youtubeLinkId: string | false = youtubeParser(message.content);
      const isSpotifyLink: string[] | false = spotifyParser(message.content);
      if (!youtubeLinkId && !isSpotifyLink) {
        const search = await fetch(
          "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=" +
          message.content +
          "&type=video&key=" +
          process.env.GOOGLE_API_KEY
        );
        const result: any = await search.json();
        youtubeLinkId = result.items[0].id.videoId;
      } else if (isSpotifyLink) {
        const type = isSpotifyLink[0];
        switch (type) {
          case "playlist":
            const spotify = await Spotify();
            const spotifyPlaylist = await spotify.getPlaylistTracks(
              isSpotifyLink[1]
            );
            console.log(spotifyPlaylist);
            playList = spotifyPlaylist.body.items;
            break;
          case "track":
            break;
          case "album":
            break;
        }
      }
      await JukeBox.addToPlayerQueue(playList, youtubeLinkId);

      if (!JukeBox.channel || JukeBox.channel.state.status === "destroyed") {
        JukeBox.enterChannel(message.member.voice.channel);
      }

      message.react("👌");
      return;
    } catch (error: any) {
      console.log(error.message);
    }
  },
};

function youtubeParser(url: string): string | false {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : false;
}

function spotifyParser(str: string): string[] | false {
  const regEx =
    /^(?:spotify:|(?:https?:\/\/(?:open|play)\.spotify\.com\/))(?:embed)?\/?(album|track|playlist)(?::|\/)((?:[0-9a-zA-Z]){22})/;
  const match = str.match(regEx);
  return match ? [match[1], match[2]] : false;
}



