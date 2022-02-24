import { AudioPlayer, createAudioResource } from "@discordjs/voice";
import Channel from "../Plugins/channel";
import stream from "youtube-audio-stream";
import fetch from "node-fetch";
var Queue = require("../db/schema/PlayQueue");
export default async (player: AudioPlayer | null) => {
  if (!player) {
    return;
  }

  player.addListener("stateChange", async (previous: any, next: any) => {
    if (next.status == "idle") {
      const removeFromQueue = previous.resource.metadata.id;

      await Queue.findByIdAndRemove(removeFromQueue);
      const song = await Queue.findOne({}).lean();

      if (!song) {
        const channel = await Channel(null, false);
        if (!channel) {
          return;
        }
        channel.destroy();
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
    }
  });
};
