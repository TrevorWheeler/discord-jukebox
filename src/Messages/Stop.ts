
import {
  Client,
  Message,
} from "discord.js";
import { MessageInteraction } from '../Types/MessageInteraction';
import JukeBox from '../Plugins/JukeBox';
export const Stop: MessageInteraction = {
  name: "stop",
  description: "Stops and removes play queue.",
  type: "MESSAGE",
  run: async (client: Client, message: Message) => {
    if (!message.guild || !message.member || !message.member?.voice.channel) {
      return "Something went wrong. Mute me instead";
    }
    JukeBox.destroyChannel();
    return;
  },
};
