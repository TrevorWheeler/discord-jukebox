import { AudioPlayer, createAudioPlayer, createAudioResource, entersState, joinVoiceChannel, NoSubscriberBehavior, VoiceConnection, VoiceConnectionStatus } from "@discordjs/voice";
import fetch from "node-fetch";
import stream from "youtube-audio-stream";
import { VoiceBasedChannel } from 'discord.js';
import Track from 'Types/Track';
import ChannelConfig from 'Types/ChannelConfig';
var Queue = require("../db/schema/PlayQueue");
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

            // const guildId = interaction.guild?.id ?? "";
            // const adapterCreator = interaction.guild?.voiceAdapterCreator!;
            // const channelId = (interaction.member as GuildMember).voice.channel?.id!;
            // const channel = joinVoiceChannel({ channelId, guildId, adapterCreator });

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

    public async addToPlayerQueue(queue: Track[], youtubeLinkId: String | false = false) {
        try {
            await Database.connect();
            if (!youtubeLinkId) {
                for (const track of queue) {
                    const artists = track.artists.map((x: SpotifyApi.ArtistObjectSimplified) => x.name);
                    const searchQuery = artists.join(" ") + " " + track.name + (!track.album.includes(track.name) ? (" " + track.album) : "");
                    const song = {
                        searchQuery: searchQuery,
                    };
                    const doc = new Queue(song);
                    await doc.save();
                }
            } else {
                const song = {
                    searchQuery: youtubeLinkId,
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
            this.player.play(createAudioResource(stream(url) as any, {
                metadata: {
                    id: song._id.toString(),
                },
            }));
        } catch (error: any) {
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
}


export default new JukeBox();


