import { AudioPlayer, createAudioResource } from "@discordjs/voice";
import fetch from "node-fetch";
import Player from "../Plugins/player";
import stream from "youtube-audio-stream";
import Channel from 'src/Plugins/channel';
var Queue = require("../db/schema/PlayQueue");
export default async () => {
  const player: AudioPlayer | null = Player();
  if (!player) {
    console.log("No player defined");
    return;
  }
  const song = await Queue.findOne({}).lean();
  if (!song) {
    console.log("could not find song.");
    await Channel(null, true);
    return;
  }

  const search = await fetch(
    "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=" +
    song.searchQuery +
    "&type=video&key=" +
    process.env.GOOGLE_API_KEY
  );

  const result = await search.json();
  const videoId = result.items[0].id.videoId;
  const url: string = "https://www.youtube.com/watch?v=" + videoId;
  const resource = createAudioResource(stream(url) as any, {
    metadata: {
      id: song._id.toString(),
    },
  });
  player.play(resource);
};
