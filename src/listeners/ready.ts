import { Client } from "discord.js";
import { Commands } from "../Commands";
export default (client: Client): void => {
  client.on("ready", async () => {
    if (!client.user || !client.application) {
      return;
    }
    client.user.setActivity("Dota 2");
    await client.application.commands.set(Commands);
    console.log(`${client.user.username} is online`);
  });
};
