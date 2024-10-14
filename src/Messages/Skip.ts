import { ApplicationCommandType, Client, Message } from "discord.js";
import { MessageInteraction } from "../Types/MessageInteraction";
import JukeBox from "../Plugins/JukeBox";
export const Skip: MessageInteraction = {
  name: "skip",
  description: "Skip Track",
  type: ApplicationCommandType.Message,
  run: async (client: Client, message: Message) => {
    await JukeBox.skip();
  },
};
