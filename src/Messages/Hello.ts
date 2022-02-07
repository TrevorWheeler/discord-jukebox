import { BaseCommandInteraction, Client } from "discord.js";
import { Command } from "../Types/Command";
import fetch from "node-fetch";
export const Hello: any = {
  name: "hello",
  description: "Returns a response from Filthy himself.",
  type: "REPLY",
  run: async () => {
    return ":)";
  },
};
