import {
  BaseCommandInteraction,
  Client,
  Interaction,
  Message,
} from "discord.js";

const {
  NoSubscriberBehavior,
  StreamType,
  createAudioPlayer,
  createAudioResource,
  entersState,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  joinVoiceChannel,
} = require("@discordjs/voice");

export const Hello: any = {
  name: "hello",
  description: "Returns a response from Filthy himself.",
  type: "REPLY",
  run: async (client: Client, message: Message) => {
    if (!message.guild) return;

    const channel = message.member?.voice.channel;
    if (channel) {
      try {
        const connection = await connectToChannel(channel);
        const player = createAudioPlayer();
        connection.subscribe(player);
        await message.reply("Hello!");
      } catch (error) {
        console.error(error);
      }
    } else {
      await message.reply("Join a voice channel then try again!");
    }

    return ":)";
  },
};

async function connectToChannel(channel: any) {
  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
  });
  try {
    await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
    return connection;
  } catch (error) {
    connection.destroy();
    throw error;
  }
}

// const player = createAudioPlayer({
//   behaviors: {
//     noSubscriber: NoSubscriberBehavior.Play,
//     maxMissedFrames: Math.round(config.maxTransmissionGap / 20),
//   },
// });

// player.on("stateChange", (oldState, newState) => {
//   if (
//     oldState.status === AudioPlayerStatus.Idle &&
//     newState.status === AudioPlayerStatus.Playing
//   ) {
//     console.log("Playing audio output on audio player");
//   } else if (newState.status === AudioPlayerStatus.Idle) {
//     console.log("Playback has stopped. Attempting to restart.");
//     attachRecorder();
//   }
// });

// function attachRecorder() {
//   player.play(
//     createAudioResource(
//       new prism.FFmpeg({
//         args: [
//           "-analyzeduration",
//           "0",
//           "-loglevel",
//           "0",
//           "-f",
//           config.type,
//           "-i",
//           config.type === "dshow" ? `audio=${config.device}` : config.device,
//           "-acodec",
//           "libopus",
//           "-f",
//           "opus",
//           "-ar",
//           "48000",
//           "-ac",
//           "2",
//         ],
//       }),
//       {
//         inputType: StreamType.OggOpus,
//       }
//     )
//   );
//   console.log("Attached recorder - ready to go!");
// }
