import { BaseCommandInteraction, Client } from "discord.js";
import { Command } from "../Types/Command";
import fetch from "node-fetch";
import { UserSteamId } from "../Types/UserSteamId";
import { Dota2Rank, dota2Ranks } from "../Types/Dota2Rank";
export const Ranks: Command = {
  name: "ranks",
  description: "Gamers DOTA ranks.",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    let content: string = "";

    for (const user in UserSteamId) {
      const steamId: UserSteamId =
        UserSteamId[user as keyof typeof UserSteamId];
      const response = await fetch(
        `https://api.opendota.com/api/players/${steamId}/`
      );

      const body = await response.json();
      console.log(body);

      const username =
        body.profile && body.profile.personaname
          ? body.profile.personaname
          : user;
      const MMR = body.solo_competitive_rank ? body.solo_competitive_rank : -1;

      const rank = dota2Ranks.find(
        (x: Dota2Rank) => MMR >= x.from && MMR <= x.to
      );

      const rankName = rank ? rank.name : "N/A";
      content += username + ": " + rankName + "\n";
    }
    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};

// example response

// const example = {
//   tracked_until: null,
//   solo_competitive_rank: 4453,
//   profile: {
//     account_id: 126716295,
//     personaname: 'Woofy The Cat',
//     name: null,
//     plus: true,
//     cheese: 0,
//     steamid: '76561198086982023',
//     avatar: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/93/936533c6fe289b6fe75fe6b78e37845c992b50e3.jpg',
//     avatarmedium: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/93/936533c6fe289b6fe75fe6b78e37845c992b50e3_medium.jpg',
//     avatarfull: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/93/936533c6fe289b6fe75fe6b78e37845c992b50e3_full.jpg',
//     profileurl: 'https://steamcommunity.com/profiles/76561198086982023/',
//     last_login: null,
//     loccountrycode: 'AU',
//     is_contributor: false
//   },
//   leaderboard_rank: null,
//   mmr_estimate: { estimate: 3955 },
//   rank_tier: 64,
//   competitive_rank: 3459
// }
