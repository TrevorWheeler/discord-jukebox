import { Client, Message } from "discord.js";
import { MessageInteraction } from '../Types/MessageInteraction';
import JukeBox from "../Plugins/JukeBox";
export const Skip: MessageInteraction = {
  name: "skip",
  description: "Skip Track",
  type: "MESSAGE",
  run: async (client: Client, message: Message) => {
    await JukeBox.skip();
  },
};
