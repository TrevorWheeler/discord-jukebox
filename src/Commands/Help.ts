import { BaseCommandInteraction, Client } from "discord.js";
import { Command } from "../Types/Command";
import fetch from "node-fetch";
export const Help: Command = {
  name: "help",
  description: "Help with Filthy slash commands.",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const content = "You need help";

    await interaction.followUp({ embeds: [exampleEmbed] });
  },
};

const exampleEmbed = {
  color: 0x0099ff,
  title: "Slash Commands",
  //   url: "https://discord.js.org",
  author: {
    name: "Filthy",
    // icon_url: "https://i.imgur.com/AfFp7pu.png",
    // url: "https://discord.js.org",
  },
  //   description: "Filthy Slash Commands",
  //   thumbnail: {
  //     url: "https://i.etsystatic.com/6099287/r/il/196a0b/3389651804/il_1140xN.3389651804_dm06.jpg",
  //   },
  fields: [
    {
      name: "/roll",
      value: "Random roll between 0 - 100",
    },
    {
      name: "/joke",
      value: "The Filthiest joke you ever heard.",
    },
    {
      name: "/ranks",
      value: "Gamers DOTA ranks.",
    },
    {
      name: "/stevesLatest",
      value: "Steves latest stealth video.",
    },
  ],
  image: {
    url: "https://cdn-japantimes.com/wp-content/uploads/2021/09/np_file_109890-scaled.jpeg",
  },
  timestamp: new Date(),
  //   footer: {
  //     text: "Some footer text here",
  //     icon_url: "https://i.imgur.com/AfFp7pu.png",
  //   },
};
