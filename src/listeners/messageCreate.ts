import { Client, Message } from "discord.js";
import { Messages } from "../Messages";

export default (client: Client): void => {
  client.on("messageCreate", async (message: Message) => {
    if (!message.content.startsWith("-f")) {
      return;
    }

    await handleMessage(client, message);
  });
};

const handleMessage = async (
  client: Client,
  message: Message
): Promise<void> => {
  if (message.content.length === 2) {
    message.reply(":)");
    return;
  }

  const command = message.content.substring(3);

  let actionRequest: string;
  if (command.substring(0, 2) === "p ") {
    actionRequest = "play";
    message.content = command.substring(2);
  } else if (command.substring(0, 4) === "stop") {
    actionRequest = "stop";
  } else if (command.substring(0, 3) === "bnc") {
    actionRequest = "bnc";
  }

  const action = Messages.find((c) => c.name === actionRequest);

  if (!action) {
    message.reply("WTF?");
    return;
  }
  await action.run(client, message);
};
