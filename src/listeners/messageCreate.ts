import { Client, Message } from "discord.js";
import { Messages } from "../Messages";

export default (client: Client, browser: any): void => {
  client.on("messageCreate", async (message: Message) => {
    if (!message.content.startsWith("-f")) {
      return;
    }

    await handleMessage(client, message, browser);
  });
};

const handleMessage = async (
  client: Client,
  message: Message,
  browser: any
): Promise<void> => {
  if (message.content.length === 2) {
    message.reply(":)");
    return;
  }

  const action = Messages.find((c) => c.name === message.content.substring(3));

  if (!action) {
    message.reply("WTF?");
    return;
  }

  const response = await action.run(client, message, browser);
  message.reply(response ? response : ":(");
};
