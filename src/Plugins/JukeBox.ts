import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  CreateVoiceConnectionOptions,
  entersState,
  joinVoiceChannel,
  JoinVoiceChannelOptions,
  NoSubscriberBehavior,
  StreamType,
  VoiceConnection,
  VoiceConnectionStatus,
} from "@discordjs/voice";
import { createWriteStream } from "fs";
import { pipeline } from "stream/promises";

import Track from "../Types/Track";
import ChannelConfig from "../Types/ChannelConfig";
import Spotify from "../Plugins/Spotify";
var Queue = require("../db/schema/PlayQueue");

const playDL = require("play-dl");
const Database = require("../db/index");
const { createReadStream } = require("fs");
const { join } = require("path");

interface IJukeBox {
  channel: VoiceConnection | null;
  player: AudioPlayer;
}
class JukeBox implements IJukeBox {
  constructor(
    public channel: VoiceConnection | null = null,
    public player: AudioPlayer = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
      },
    })
  ) {
    this.player.on("stateChange", (oldState, newState) => {
      console.log(newState);
      console.log(
        `Audio player state changed from ${oldState.status} to ${newState.status}`
      );
      if (newState.status === "playing") {
        console.log("Audio is now playing!");
      }
    });
    player.addListener("stateChange", async (previous: any, next: any) => {
      if (next.status == "idle") {
        const removeFromQueue = previous.resource.metadata.id;
        await Queue.findByIdAndRemove(removeFromQueue);
        const nextSongInQueue = await Queue.findOne({}).lean();
        if (!nextSongInQueue && this.channel) {
          this.destroyChannel();
          return;
        }
        const search = await fetch(
          "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=" +
            nextSongInQueue.searchQuery +
            "&type=video&key=" +
            process.env.GOOGLE_API_KEY
        );
        const result = await search.json();
        const videoId = result.items[0].id.videoId;
        const url: string = "https://www.youtube.com/watch?v=" + videoId;
        let stream = await playDL.stream(url);
        const resource = createAudioResource(stream.stream, {
          metadata: {
            id: nextSongInQueue._id.toString(),
          },
          inlineVolume: true,
        });
        resource.volume?.setVolume(1); // Set volume to 100%
        player.play(resource);
      }
    });

    this.player.on(AudioPlayerStatus.Buffering, () => {
      console.log("The audio player is buffering...");
    });

    this.player.on(AudioPlayerStatus.Playing, () => {
      console.log("The audio player has started playing!");
    });

    this.player.on(AudioPlayerStatus.Idle, () => {
      console.log("The audio player is idle.");
    });

    this.player.on("error", (error) => {
      console.error("Error in audio player:", error);
    });

    this.player.on("error", (error) => {
      console.error("Error in audio player:", error);
    });

    if (this.channel) {
      this.channel.on("error", (error) => {
        console.error("Error in voice connection:", error);
      });
    }
  }
  get playerActive() {
    return this.player.state.status === "playing";
  }

  get channelInactive() {
    return !this.channel || this.channel.state.status === "destroyed";
  }
  async enterChannel(
    config: CreateVoiceConnectionOptions & JoinVoiceChannelOptions
  ) {
    try {
      this.channel = joinVoiceChannel(config);
      if (!this.channel) {
        throw new Error("Channel failed to initialise.");
      }
      const channel: VoiceConnection = this.channel;
      channel.on(VoiceConnectionStatus.Ready, () => {
        console.log("Join request recieved. Ready to join.");
      });
      channel.on(
        VoiceConnectionStatus.Disconnected,
        async (prev: any, next: any) => {
          await Promise.race([
            entersState(channel, VoiceConnectionStatus.Signalling, 5_000),
            entersState(channel, VoiceConnectionStatus.Connecting, 5_000),
          ]);
        }
      );
      await entersState(this.channel, VoiceConnectionStatus.Ready, 30_000);
      this.channel.subscribe(this.player);
      console.log("Subscribed to player");
      await this.play();
      console.log("Play method called");
    } catch (error: any) {
      console.error("Error in enterChannel:", error.message);
      console.error("Stack trace:", error.stack);
      if (this.channel) {
        this.channel.destroy();
      }
      this.channel = null;
    }
  }
  async destroyChannel() {
    try {
      await Queue.deleteMany({});
      this.player.stop();
      if (!this.channel) {
        throw new Error("No channel to destroy.");
      }
      this.channel.destroy();
    } catch (error: any) {
      console.error(error.message);
    }
  }

  public async addToPlayerQueue(queue: Track[]) {
    try {
      await Database.connect();
      console.log("Adding to queue:", queue.length, "tracks");
      for (const track of queue) {
        const artists = track.artists.map(
          (x: SpotifyApi.ArtistObjectSimplified) => x.name
        );
        const searchQuery =
          artists.join(" ") +
          " " +
          track.name +
          (!track.album.includes(track.name) ? " " + track.album : "");
        const song = {
          youtubeTitle: track.youtubeTitle,
          searchQuery: searchQuery.trim(),
        };
        const doc = new Queue(song);
        const a = await doc.save();
        console.log(a);
      }
    } catch (error: any) {
      console.error("Error adding to queue:", error.message);
    }
  }

  public async play() {
    try {
      console.log("Starting play method");
      const song = await Queue.findOne({}).lean();
      if (!song) {
        console.log("No song in queue, destroying channel");
        this.destroyChannel();
        return;
      }
      console.log("Search query:", song.searchQuery);

      let streamed = await playDL.stream(song.searchQuery, {
        discordPlayerCompatibility: true,
        quality: 2, // This ensures we get a format Discord can understand
      });

      // Add this logging
      streamed.stream.on("data", (chunk: any) => {
        console.log(`Received ${chunk.length} bytes of data.`);
      });

      streamed.stream.on("end", () => {
        console.log("Stream ended");
      });

      let resource = createAudioResource(streamed.stream, {
        inputType: StreamType.Arbitrary, // Use Arbitrary instead of stream.type
        inlineVolume: true,
      });

      console.log("Audio resource created");

      this.player.play(resource);
      console.log("Player.play() called");

      // console.log("Search query:", song.searchQuery);

      // const searchResult = await playDL.search(song.searchQuery, { limit: 1 });
      // if (!searchResult || searchResult.length === 0) {
      //   console.log("No search results found");
      //   throw new Error("No search results found");
      // }

      // const video = searchResult[0];
      // console.log("Video found:", video.title);

      // const stream = await playDL.stream(video.url, {
      //   discordPlayerCompatibility: true,
      //   stream_from_info: true,
      // });

      // // const silentFile = join(__dirname, "example.mp3");
      // // const resource = createAudioResource(createReadStream(silentFile));
      // // this.player.play(resource);

      // const resource = createAudioResource(stream.stream, {
      //   inputType: stream.type,
      //   metadata: {
      //     id: song._id.toString(),
      //   },
      //   inlineVolume: true,
      // });

      // console.log("Audio resource created");

      // this.player.play(resource);
      // console.log("Player started playing");
    } catch (error: any) {
      console.error("Error in play method:", error.message);
      console.error("Stack trace:", error.stack);
    }
  }

  public async skip() {
    try {
      this.player.stop();
      await Queue.findOneAndRemove();
      this.play();
    } catch (error: any) {
      console.error(error.message);
    }
  }

  public async getPlayerQueue(
    query: string,
    isShow: boolean = false
  ): Promise<Track[]> {
    const queue: Track[] = [];
    const isSpotifyLink: string[] | false = spotifyParser(query);
    let youtubeLinkId: string | false = youtubeParser(query);
    if (!youtubeLinkId && !isSpotifyLink) {
      const search = await fetch(
        "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=" +
          query +
          "&type=video&key=" +
          process.env.GOOGLE_API_KEY
      );
      const result: any = await search.json();

      if (!isShow) {
        youtubeLinkId = result.items[0].id.videoId;
        if (!youtubeLinkId) {
          return [];
        }

        queue.push(
          ...[
            {
              name: youtubeLinkId,
              album: "",
              artists: [],
              youtubeTitle: result.items[0].snippet.title,
            },
          ]
        );
      } else {
        for (const item of result.items) {
          youtubeLinkId = item.id.videoId;
          if (!youtubeLinkId) {
            return [];
          }
          queue.push({
            name: youtubeLinkId,
            album: "",
            artists: [],
            youtubeTitle: item.snippet.title,
          });
        }
      }
    } else if (isSpotifyLink) {
      const [spotifyRequestType, id]: string[] = isSpotifyLink;
      const spotify = await Spotify();
      switch (spotifyRequestType) {
        case "playlist":
          const playlist = await spotify.getPlaylistTracks(id);
          const playlistTracks: SpotifyApi.PlaylistTrackObject[] = shuffle(
            playlist.body.items
          );

          queue.push(
            ...playlistTracks.map((x: SpotifyApi.PlaylistTrackObject) => {
              const artists = x.track.artists.map(
                (x: SpotifyApi.ArtistObjectSimplified) => x.name
              );
              return {
                name: x.track.name,
                album: x.track.album.name,
                artists: x.track.artists,
                youtubeTitle: x.track.name + " - " + artists.join(" "),
              };
            })
          );
          break;
        case "track":
          const track = await spotify.getTrack(id);
          const artists = track.body.artists.map(
            (x: SpotifyApi.ArtistObjectSimplified) => x.name
          );
          queue.push(
            ...[
              {
                name: track.body.name,
                album: track.body.album.name,
                artists: track.body.artists,
                youtubeTitle: track.body.name + " - " + artists.join(" "),
              },
            ]
          );
          break;
        case "album":
          const album = await spotify.getAlbum(id);
          const albumTracks: SpotifyApi.TrackObjectSimplified[] =
            album.body.tracks.items;
          queue.push(
            ...albumTracks.map((x: SpotifyApi.TrackObjectSimplified) => {
              const artists = x.artists.map(
                (x: SpotifyApi.ArtistObjectSimplified) => x.name
              );
              return {
                name: x.name,
                album: album.body.name,
                artists: x.artists,
                youtubeTitle: x.name + " - " + artists.join(" "),
              };
            })
          );
          break;
      }
    }
    return queue;
  }
}

export default new JukeBox();

function youtubeParser(url: string): string | false {
  const match = url.match(
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/
  );
  return match && match[7].length === 11 ? match[7] : false;
}

function spotifyParser(str: string): string[] | false {
  const match = str.match(
    /^(?:spotify:|(?:https?:\/\/(?:open|play)\.spotify\.com\/))(?:embed)?\/?(album|track|playlist)(?::|\/)((?:[0-9a-zA-Z]){22})/
  );
  return match ? [match[1], match[2]] : false;
}

function shuffle(
  array: SpotifyApi.PlaylistTrackObject[]
): SpotifyApi.PlaylistTrackObject[] {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}
