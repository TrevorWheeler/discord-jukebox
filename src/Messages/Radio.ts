import { Client, Message } from "discord.js";

const {
  NoSubscriberBehavior,
  createAudioPlayer,
  createAudioResource,
  entersState,
  VoiceConnectionStatus,
  joinVoiceChannel,
} = require("@discordjs/voice");

export const Radio: any = {
  name: "radio",
  description: "Plays JJJ.",
  type: "REPLY",
  run: async (client: Client, message: Message) => {
    if (!message.guild || !message.member || !message.member?.voice.channel) {
      return;
    }
    let connection: any;
    try {
      const channel = message.member?.voice.channel;
      connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      });
      await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
      const player = createAudioPlayer({
        behaviors: {
          noSubscriber: NoSubscriberBehavior.Pause,
        },
      });
      const resource = createAudioResource(
        "https://live-radio01.mediahubaustralia.com/2TJW/mp3/"
      );
      player.play(resource);

      connection.subscribe(player);
      return;
    } catch (error: any) {
      if (connection) {
        connection.destroy();
      }
      console.log(error.message);
      return error.message;
    }
  },
};
