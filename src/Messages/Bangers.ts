import { ApplicationCommandType, Client, Message } from "discord.js";
import Track from "Types/Track";
import JukeBox from "../Plugins/JukeBox";
import Spotify from "../Plugins/Spotify";
import { MessageInteraction } from "../Types/MessageInteraction";
import {
  CreateVoiceConnectionOptions,
  DiscordGatewayAdapterCreator,
  JoinVoiceChannelOptions,
} from "@discordjs/voice";
export const Bangers: MessageInteraction = {
  name: "bnc",
  description: "Plays Bangers",
  type: ApplicationCommandType.Message,
  run: async (client: Client, message: Message) => {
    if (!message.guild || !message.member || !message.member?.voice.channel) {
      return "nope";
    }
    try {
      const spotify = await Spotify();
      const spotifyPlaylist = await spotify.getPlaylistTracks(
        "6Lbd3XVZtsatcq3vuK9PkV"
      );

      const playlist: SpotifyApi.PlaylistTrackObject[] =
        spotifyPlaylist.body.items;
      const queue: Track[] = shuffle(
        playlist.map((x) => {
          return {
            name: x.track.name,
            album: x.track.album.name,
            artists: x.track.artists,
          };
        })
      );
      await JukeBox.addToPlayerQueue(queue);

      if (JukeBox.channelInactive) {
        const channelConfig: CreateVoiceConnectionOptions &
          JoinVoiceChannelOptions = {
          guildId: message.member.voice.channel.guild.id,
          channelId: message.member.voice.channel.id,
          adapterCreator: message.member.voice.channel.guild
            .voiceAdapterCreator as DiscordGatewayAdapterCreator,
        };

        JukeBox.enterChannel(channelConfig);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  },
};

function shuffle(array: Track[]): Track[] {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}
