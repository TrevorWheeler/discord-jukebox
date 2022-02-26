
import {
  Client,
  Message,
} from "discord.js";
import JukeBox from '../Plugins/JukeBox';
var Queue = require("../db/schema/PlayQueue");
export const Stop: any = {
  name: "stop",
  description: "Stops and removes play queue.",
  type: "REPLY",
  run: async (client: Client, message: Message) => {
    if (!message.guild || !message.member || !message.member?.voice.channel) {
      return "Something went wrong. Mute me instead";
    }
    await Queue.deleteMany({});

    JukeBox.destroyChannel();
    return;
  },
};
