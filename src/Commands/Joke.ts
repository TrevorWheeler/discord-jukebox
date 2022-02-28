import { BaseCommandInteraction, Client, Message } from "discord.js";
import { CommandInteraction } from "../Types/CommandInteraction";
import fetch from "node-fetch";
export const Joke: CommandInteraction = {
  name: "joke",
  description: "The Filthiest joke you ever heard.",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction | Message) => {
    interaction = interaction as BaseCommandInteraction;
    const jokeResponse = await fetch("https://api.jokes.one/jod");
    const joke: any = await jokeResponse.json();
    const content: string = joke.contents.jokes[0].joke.text;
    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
