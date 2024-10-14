import { Client, Message } from "discord.js";
import { MessageInteraction } from "../Types/MessageInteraction";
import { Messages } from "../handlers/Messages";

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
  let interactionRequest: string;

  if (command.substring(0, 3) === "ai ") {
    interactionRequest = "aiChat";
    message.content = command.substring(3);
  } else {
    await message.reply("Sorry, my shits all broken.");
    return;
  }

  // if (command.substring(0, 1) === "q") {
  //   interactionRequest = "listQueue";
  // } else if (command.substring(0, 2) === "p ") {
  //   interactionRequest = "play";
  //   message.content = command.substring(2);
  // } else if (command.substring(0, 3) === "ai ") {
  //   interactionRequest = "aiChat";
  //   message.content = command.substring(3);
  // } else if (command.substring(0, 3) === "bnc") {
  //   interactionRequest = "bnc";
  // } else if (command.substring(0, 4) === "stop") {
  //   interactionRequest = "stop";
  // } else if (command.substring(0, 4) === "skip") {
  //   interactionRequest = "skip";
  // } else if (command.substring(0, 4) === "show") {
  //   interactionRequest = "show";
  //   message.content = command.substring(5);
  // }

  const action: MessageInteraction | undefined = Messages.find(
    (messageInteraction: MessageInteraction) =>
      messageInteraction.name === interactionRequest
  );
  if (!action) {
    message.reply("WTF?");
    return;
  }
  action.run(client, message);
};
