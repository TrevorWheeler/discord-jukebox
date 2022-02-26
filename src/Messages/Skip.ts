import { Client, Message } from "discord.js";
import JukeBox from "../Plugins/JukeBox";
export const Skip: any = {
  name: "skip",
  description: "Skip Track",
  type: "REPLY",
  run: async (client: Client, message: Message) => {
    await JukeBox.skip();

  },
};
