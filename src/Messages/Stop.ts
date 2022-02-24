import { createDefaultAudioReceiveStreamOptions } from "@discordjs/voice";
import {
  BaseCommandInteraction,
  Client,
  Interaction,
  Message,
} from "discord.js";
var Queue = require("../db/schema/PlayQueue");
import Channel from "../Plugins/channel";
export const Stop: any = {
  name: "stop",
  description: "Stops and removes play queue.",
  type: "REPLY",
  run: async (client: Client, message: Message) => {
    if (!message.guild || !message.member || !message.member?.voice.channel) {
      return "Something went wrong. Mute me instead";
    }
    await Queue.deleteMany({});
    const channel = await Channel(null, false);
    if (!channel) {
      return;
    }
    channel.destroy();
    await Channel(null, true);
    console.log(channel);
    return;
  },
};
