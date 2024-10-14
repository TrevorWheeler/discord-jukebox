import {
  Client,
  EmbedField,
  Message,
  ApplicationCommandType,
} from "discord.js";
import { MessageInteraction } from "../Types/MessageInteraction";
var Queue = require("../db/schema/PlayQueue");
const Database = require("../db/index");
export const ListQueue: MessageInteraction = {
  name: "listQueue",
  description: "Lists player queue.",
  type: ApplicationCommandType.Message,
  run: async (client: Client, message: Message) => {
    try {
      await Database.connect();
      const queue = await Queue.find({}).limit(10);
      console.log(queue);

      if (!queue || queue.length === 0) {
        message.reply("Queue is empty :(");
        return;
      }

      const queueResponse: string = queue
        .map(
          (x: any, index: number) => index + 1 + ". " + x.youtubeTitle + "\n"
        )
        .join("");
      message.reply(queueResponse);
    } catch (error: any) {
      console.log(error.message);
    }
  },
};
