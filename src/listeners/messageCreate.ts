import { BaseCommandInteraction, Client, Interaction } from "discord.js";
import { Messages } from "../Messages";
export default (client: Client): void => {
  client.on("messageCreate", async (message: any) => {
    if (!message.content.startsWith("-f")) {
      return;
    }
    await handleMessage(client, message);
  });
};

const handleMessage = async (client: Client, message: any): Promise<void> => {
  if (message.content.length === 2) {
    message.reply(":)");
    return;
  }

  const action = Messages.find((c) => c.name === message.content.substring(2));

  if (!action) {
    message.reply("WTF?");
    return;
  }

  const response = action.run();
  message.reply(response ? response : ":(");
};
