import { Client, Message } from "discord.js";
import playQueue from '../handlers/playQueue';
var Queue = require("../db/schema/PlayQueue");
export const Skip: any = {
  name: "skip",
  description: "Skip Track",
  type: "REPLY",
  run: async (client: Client, message: Message) => {
    await Queue.deleteOne({});
    await playQueue();
  },
};
