import {
  CommandInteraction,
  Client,
  Message,
  ApplicationCommandType,
} from "discord.js";

import { Command } from "../Types/CommandInteraction";

const fallbackJokes = [
  "Why don't scientists trust atoms? Because they make up everything!",
  "Why did the scarecrow win an award? He was outstanding in his field!",
  "Why don't eggs tell jokes? They'd crack each other up!",
  "What do you call a fake noodle? An impasta!",
  "Why did the math book look so sad? Because it had too many problems.",
];

export const Joke: Command = {
  name: "joke",
  description: "Get a random joke.",
  type: ApplicationCommandType.ChatInput,
  run: async (client: Client, interaction: CommandInteraction | Message) => {
    if (interaction instanceof CommandInteraction) {
      try {
        const jokeResponse = await fetch(
          "https://official-joke-api.appspot.com/random_joke"
        );

        if (!jokeResponse.ok) {
          throw new Error(`HTTP error! status: ${jokeResponse.status}`);
        }

        const joke = await jokeResponse.json();

        if (!joke.setup || !joke.punchline) {
          throw new Error("Invalid joke format received");
        }

        const content = `${joke.setup}\n\n${joke.punchline}`;
        await interaction.reply({
          ephemeral: true,
          content,
        });
      } catch (error) {
        console.error("Error fetching joke:", error);
        const fallbackJoke =
          fallbackJokes[Math.floor(Math.random() * fallbackJokes.length)];
        await interaction.reply({
          ephemeral: true,
          content: `Here's a joke while our main joke service is down: ${fallbackJoke}`,
        });
      }
    } else {
      // Handle message commands if needed
    }
  },
};
