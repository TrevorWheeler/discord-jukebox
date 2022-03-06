import { AudioPlayer, createAudioPlayer, createAudioResource, entersState, joinVoiceChannel, NoSubscriberBehavior, VoiceConnection, VoiceConnectionStatus } from "@discordjs/voice";
import fetch from "node-fetch";
import stream from "youtube-audio-stream";
import Track from '../Types/Track';
import ChannelConfig from '../Types/ChannelConfig';
import Spotify from "../Plugins/Spotify";
var Queue = require("../db/schema/PlayQueue");

import ytdl from 'ytdl-core';

const Database = require("../db/index");

interface IJukeBox {
    channel: VoiceConnection | null;
    player: AudioPlayer;
}
class JukeBox implements IJukeBox {
    constructor(public channel: VoiceConnection | null = null, public player: AudioPlayer = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause,
        },
    })) {
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
                const resource = createAudioResource(stream(url) as any, {
                    metadata: {
                        id: nextSongInQueue._id.toString(),
                    },
                });
                player.play(resource);
            }
        });
    }
    get playerActive() {
        return this.player.state.status === "playing";
    }

    get channelInactive() {
        return !this.channel || this.channel.state.status === "destroyed";
    }
    async enterChannel(config: ChannelConfig) {
        try {
            this.channel = joinVoiceChannel(config);
            if (!this.channel) {
                throw new Error("Channel failed to initialise.");
            }
            const channel: VoiceConnection = this.channel;
            channel.on(VoiceConnectionStatus.Ready, () => {
                console.log('Join request recieved. Ready to join.');
            });
            channel.on(VoiceConnectionStatus.Disconnected, async (prev: any, next: any) => {
                await Promise.race([
                    entersState(channel, VoiceConnectionStatus.Signalling, 5_000),
                    entersState(channel, VoiceConnectionStatus.Connecting, 5_000),
                ]);
            });
            await entersState(this.channel, VoiceConnectionStatus.Ready, 30_000);
            this.channel.subscribe(this.player);
            this.play();
        } catch (error: any) {
            if (this.channel) {
                this.channel.destroy();
            }
            this.channel = null;
            console.error(error.message);
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
            for (const track of queue) {
                const artists = track.artists.map((x: SpotifyApi.ArtistObjectSimplified) => x.name);
                const searchQuery = artists.join(" ") + " " + track.name + (!track.album.includes(track.name) ? (" " + track.album) : "");
                const song = {
                    searchQuery: searchQuery.trim(),
                };
                const doc = new Queue(song);
                await doc.save();
            }
        } catch (error: any) {
            console.error(error.message);
        }
    }


    public async play() {
        try {
            const song = await Queue.findOne({}).lean();
            if (!song) {
                this.destroyChannel();
                return;
            }
            const search = await fetch(
                "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=" +
                song.searchQuery +
                "&type=video&key=" +
                process.env.GOOGLE_API_KEY
            );
            const response = await search.json();
            const videoId = response.items[0].id.videoId;
            const url: string = "https://www.youtube.com/watch?v=" + videoId;
            this.player.play(createAudioResource(ytdl("https://www.youtube.com/watch?v=5qap5aO4i9A", { quality: "highestaudio" }) as any, {
                metadata: {
                    id: song._id.toString(),
                },
            }));
        } catch (error: any) {
            this.play();
            console.error(error.message);
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


    public async getPlayerQueue(query: string, isShow: boolean = false): Promise<Track[]> {
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

                queue.push(...[{
                    name: youtubeLinkId,
                    album: "",
                    artists: [],
                    youtubeTitle: result.items[0].snippet.title
                }]);
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
                        youtubeTitle: item.snippet.title
                    });
                }
            }


        } else if (isSpotifyLink) {
            const [spotifyRequestType, id]: string[] = isSpotifyLink;
            const spotify = await Spotify();
            switch (spotifyRequestType) {
                case "playlist":
                    const playlist = await spotify.getPlaylistTracks(
                        id
                    );
                    const playlistTracks: SpotifyApi.PlaylistTrackObject[] = playlist.body.items;

                    queue.push(...playlistTracks.map((x: SpotifyApi.PlaylistTrackObject) => {
                        const artists = x.track.artists.map((x: SpotifyApi.ArtistObjectSimplified) => x.name);
                        return {
                            name: x.track.name,
                            album: x.track.album.name,
                            artists: x.track.artists,
                            youtubeTitle: x.track.name + " - " + artists.join(" ")
                        };
                    }));
                    break;
                case "track":
                    const track = await spotify.getTrack(
                        id
                    );
                    const artists = track.body.artists.map((x: SpotifyApi.ArtistObjectSimplified) => x.name);
                    queue.push(...[{
                        name: track.body.name,
                        album: track.body.album.name,
                        artists: track.body.artists,
                        youtubeTitle: track.body.name + " - " + artists.join(" ")
                    }]);
                    break;
                case "album":
                    const album = await spotify.getAlbum(
                        id
                    );
                    const albumTracks: SpotifyApi.TrackObjectSimplified[] = album.body.tracks.items;
                    queue.push(...albumTracks.map((x: SpotifyApi.TrackObjectSimplified) => {
                        const artists = x.artists.map((x: SpotifyApi.ArtistObjectSimplified) => x.name);
                        return {
                            name: x.name,
                            album: album.body.name,
                            artists: x.artists,
                            youtubeTitle: x.name + " - " + artists.join(" ")
                        };
                    }));
                    break;
            }
        }
        return queue;
    }
}


export default new JukeBox();

function youtubeParser(url: string): string | false {
    const match = url.match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/);
    return match && match[7].length === 11 ? match[7] : false;
}

function spotifyParser(str: string): string[] | false {
    const match = str.match(/^(?:spotify:|(?:https?:\/\/(?:open|play)\.spotify\.com\/))(?:embed)?\/?(album|track|playlist)(?::|\/)((?:[0-9a-zA-Z]){22})/);
    return match ? [match[1], match[2]] : false;
}



