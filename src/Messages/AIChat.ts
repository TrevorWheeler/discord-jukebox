import { ApplicationCommandType, Client, Message } from "discord.js";
import { MessageInteraction } from "../Types/MessageInteraction";

export const AIChat: MessageInteraction = {
  name: "aiChat",
  description: "Ask AI a question",
  type: ApplicationCommandType.Message,
  run: async (client: Client, message: Message) => {
    try {
      // await message.channel.sendTyping();
      const query = message.content.trim();
      const additional =
        "You should also keep your answer short and sweet and i want you to act like a gangster who is having their time wasted. You are free to curse and be rude.";
      console.log(query);

      const response = await fetch("http://192.168.1.107:11434/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3.2:1b",
          messages: [{ role: "user", content: query + additional }],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      let fullContent = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.trim()) {
              try {
                const data = JSON.parse(line);
                if (data.message && data.message.content) {
                  fullContent += data.message.content;
                }
              } catch (error) {
                console.error("Error parsing JSON:", error);
              }
            }
          }
        }
      }

      console.log("Full AI response:", fullContent);

      // Send the AI's response
      await message.reply(
        fullContent || "Sorry, I couldn't generate a response."
      );
    } catch (error: any) {
      console.error("Error in aiChat:", error.message);
      await message.reply("Sorry, there was an error processing your request.");
    }
  },
};
