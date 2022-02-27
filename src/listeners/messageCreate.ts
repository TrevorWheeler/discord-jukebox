import { Client, Message } from "discord.js";
import { Messages } from '../Messages';

export default (client: Client): void => {
  client.on("messageCreate", async (message: Message) => {
    const command: string | undefined = process.env.NODE_ENV !== 'development' ? process.env.BOT_COMMAND : process.env.BOT_COMMAND_DEV;
    if (!message.content.startsWith(command ? command : "-f")) {
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
  } else if (command.substring(0, 3) === "bnc") {
    actionRequest = "bnc";
  } else if (command.substring(0, 4) === "stop") {
    actionRequest = "stop";
  } else if (command.substring(0, 4) === "skip") {
    actionRequest = "skip";
  } else if (command.substring(0, 4) === "show") {
    actionRequest = "show";
    message.content = command.substring(5);
  }

  const action = Messages.find((c) => c.name === actionRequest);
  if (!action) {
    message.reply("WTF?");
    return;
  }
  await action.run(client, message);
};
