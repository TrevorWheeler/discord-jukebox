import { AudioPlayer, CreateAudioPlayerOptions } from "@discordjs/voice";

const {
  NoSubscriberBehavior,
  createAudioPlayer,
  createAudioResource,
  entersState,
  VoiceConnectionStatus,
  joinVoiceChannel,
  generateDependencyReport,
} = require("@discordjs/voice");

let instance: AudioPlayer | null = null;

export default () => {
  if (!instance) {
    instance = createAudioPlayer({
      behaviors: {
        debug: false,
        noSubscriber: NoSubscriberBehavior.Pause,
      },
    });
  }
  return instance;
};
