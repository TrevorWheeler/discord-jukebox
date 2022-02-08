import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import { Command } from "../Types/Command";
import fetch from "node-fetch";
import { UserSteamId } from "../Types/UserSteamId";
import * as cheerio from "cheerio";
export const Ranks: Command = {
  name: "ranks",
  description: "Gamers DOTA ranks.",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    let content: string = "Doesnt look good.";

    for (const user in UserSteamId) {
      const steamId: UserSteamId =
        UserSteamId[user as keyof typeof UserSteamId];
      const response = await fetch(
        `https://www.dotabuff.com/players/${steamId}/`
      );
      const body = await response.text();
      const $ = cheerio.load(body);
      const rankImageSrc = $(".rank-tier-base").attr("src");
      const exampleEmbed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle(user)
        .setURL(`https://www.dotabuff.com/players/${steamId}/`)
        .setThumbnail(rankImageSrc ? rankImageSrc : "")
        .setTimestamp();
      await interaction.followUp({ embeds: [exampleEmbed] });
    }
  },
};
